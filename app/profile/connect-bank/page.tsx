"use client"

import type React from "react"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Sidebar } from "@/components/sidebar"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { GlobalScrollContainer } from "@/components/global-scroll-container"
import { StaticHorizontalMenu } from "@/components/static-horizontal-menu"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation"
import { BanknoteIcon as BankIcon, CreditCard, User, Mail, CheckCircle, AlertCircle } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ConnectBankPage() {
  const router = useRouter()
  const [step, setStep] = useState<"form" | "verification" | "success">("form")
  const [bankMethod, setBankMethod] = useState<"ach" | "card">("ach")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    accountName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    agreeTerms: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("verification")
    }, 1500)
  }

  const handleVerify = () => {
    setIsSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setStep("success")
    }, 1500)
  }

  const handleFinish = () => {
    router.push("/profile")
  }

  return (
    <div className="flex flex-col h-full bg-black text-white overflow-hidden">
      <SiteHeader />
      <StaticHorizontalMenu />

      <GlobalScrollContainer>
        <div className="flex min-h-0">
          <Sidebar />

          <main className="flex-1">
            <div className="px-4 pb-32 md:pb-32 pt-6">
              {" "}
              {/* Increased bottom padding */}
              <h1 className="text-3xl font-medium mb-6">Connect Bank Account</h1>
              <div className="max-w-2xl mx-auto">
                {step === "form" && (
                  <Card className="bg-gray-900 border-gray-800 mb-32">
                    {" "}
                    {/* Increased bottom margin */}
                    <CardHeader>
                      <CardTitle>Connect Your Account</CardTitle>
                      <CardDescription>Connect your bank account to receive your prize winnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="ach" onValueChange={(value) => setBankMethod(value as "ach" | "card")}>
                        <TabsList className="grid w-full grid-cols-2 bg-gray-800">
                          <TabsTrigger value="ach">
                            <BankIcon className="h-4 w-4 mr-2" />
                            Bank Account (ACH)
                          </TabsTrigger>
                          <TabsTrigger value="card">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Debit Card
                          </TabsTrigger>
                        </TabsList>

                        {bankMethod === "card" && (
                          <Alert className="mt-4 bg-blue-500/10 border-blue-600">
                            <AlertCircle className="h-4 w-4 text-blue-500" />
                            <AlertDescription className="text-blue-400">
                              A 3% processing fee will be applied to all debit card payouts.
                            </AlertDescription>
                          </Alert>
                        )}

                        <TabsContent value="ach">
                          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="accountName">Account Holder Name</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                  id="accountName"
                                  name="accountName"
                                  value={formData.accountName}
                                  onChange={handleChange}
                                  placeholder="Full Name on Account"
                                  required
                                  className="bg-gray-800 border-gray-700 pl-10"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="routingNumber">Routing Number</Label>
                                <Input
                                  id="routingNumber"
                                  name="routingNumber"
                                  value={formData.routingNumber}
                                  onChange={handleChange}
                                  placeholder="9 digits"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="accountNumber">Account Number</Label>
                                <Input
                                  id="accountNumber"
                                  name="accountNumber"
                                  value={formData.accountNumber}
                                  onChange={handleChange}
                                  placeholder="Account Number"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="accountType">Account Type</Label>
                              <select
                                id="accountType"
                                name="accountType"
                                value={formData.accountType}
                                onChange={(e) => setFormData((prev) => ({ ...prev, accountType: e.target.value }))}
                                required
                                className="w-full bg-gray-800 border border-gray-700 rounded-md px-3 py-2 text-sm"
                              >
                                <option value="">Select Account Type</option>
                                <option value="checking">Checking</option>
                                <option value="savings">Savings</option>
                              </select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                  id="name"
                                  name="name"
                                  value={formData.name}
                                  onChange={handleChange}
                                  placeholder="Your Full Name"
                                  required
                                  className="bg-gray-800 border-gray-700 pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="email">Email Address</Label>
                              <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                  id="email"
                                  name="email"
                                  type="email"
                                  value={formData.email}
                                  onChange={handleChange}
                                  placeholder="email@example.com"
                                  required
                                  className="bg-gray-800 border-gray-700 pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="address">Address</Label>
                              <Input
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street Address"
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-2 col-span-2 md:col-span-2">
                                <Label htmlFor="city">City</Label>
                                <Input
                                  id="city"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="City"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="state">State</Label>
                                <Input
                                  id="state"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleChange}
                                  placeholder="State"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="zip">ZIP Code</Label>
                                <Input
                                  id="zip"
                                  name="zip"
                                  value={formData.zip}
                                  onChange={handleChange}
                                  placeholder="ZIP"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox
                                id="agreeTerms"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onCheckedChange={(checked) =>
                                  setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                                }
                                required
                              />
                              <label
                                htmlFor="agreeTerms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I agree to the terms and conditions and authorize Thropic Games to verify my bank
                                account
                              </label>
                            </div>
                          </form>
                        </TabsContent>

                        <TabsContent value="card">
                          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                            <div className="space-y-2">
                              <Label htmlFor="cardName">Name on Card</Label>
                              <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                                <Input
                                  id="cardName"
                                  name="accountName"
                                  value={formData.accountName}
                                  onChange={handleChange}
                                  placeholder="Full Name on Card"
                                  required
                                  className="bg-gray-800 border-gray-700 pl-10"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="cardNumber">Card Number</Label>
                              <Input
                                id="cardNumber"
                                name="accountNumber"
                                value={formData.accountNumber}
                                onChange={handleChange}
                                placeholder="Card Number"
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="expiryDate">Expiry Date</Label>
                                <Input
                                  id="expiryDate"
                                  name="routingNumber"
                                  value={formData.routingNumber}
                                  onChange={handleChange}
                                  placeholder="MM/YY"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Input
                                  id="cvv"
                                  name="accountType"
                                  value={formData.accountType}
                                  onChange={handleChange}
                                  placeholder="CVV"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="billingAddress">Billing Address</Label>
                              <Input
                                id="billingAddress"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Street Address"
                                required
                                className="bg-gray-800 border-gray-700"
                              />
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <div className="space-y-2 col-span-2 md:col-span-2">
                                <Label htmlFor="billingCity">City</Label>
                                <Input
                                  id="billingCity"
                                  name="city"
                                  value={formData.city}
                                  onChange={handleChange}
                                  placeholder="City"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="billingState">State</Label>
                                <Input
                                  id="billingState"
                                  name="state"
                                  value={formData.state}
                                  onChange={handleChange}
                                  placeholder="State"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="billingZip">ZIP Code</Label>
                                <Input
                                  id="billingZip"
                                  name="zip"
                                  value={formData.zip}
                                  onChange={handleChange}
                                  placeholder="ZIP"
                                  required
                                  className="bg-gray-800 border-gray-700"
                                />
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 mt-4">
                              <Checkbox
                                id="agreeTermsCard"
                                name="agreeTerms"
                                checked={formData.agreeTerms}
                                onCheckedChange={(checked) =>
                                  setFormData((prev) => ({ ...prev, agreeTerms: checked as boolean }))
                                }
                                required
                              />
                              <label
                                htmlFor="agreeTermsCard"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                I agree to the terms and conditions and authorize Thropic Games to charge my card if
                                necessary
                              </label>
                            </div>
                          </form>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                    <CardFooter className="flex justify-between pb-6">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/profile")}
                        className="bg-gray-800 border-gray-700"
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || !formData.agreeTerms}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {isSubmitting ? "Processing..." : "Continue"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {step === "verification" && (
                  <Card className="bg-gray-900 border-gray-800 mb-32">
                    {" "}
                    {/* Increased bottom margin */}
                    <CardHeader>
                      <CardTitle>Verify Your Account</CardTitle>
                      <CardDescription>
                        We've sent two small deposits to your bank account to verify ownership
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="bg-gray-800 p-4 rounded-lg">
                          <p className="text-gray-300 mb-4">
                            To verify your account, we've sent two small deposits (less than $1.00 each) to your bank
                            account. These deposits will appear in your account in 1-2 business days with a description
                            like "THROPIC VERIFY".
                          </p>
                          <p className="text-gray-300">
                            Once you see these deposits, return to this page and enter the amounts to verify your
                            account.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="deposit1">First Deposit Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <Input id="deposit1" placeholder="0.00" className="bg-gray-800 border-gray-700 pl-8" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="deposit2">Second Deposit Amount</Label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                $
                              </span>
                              <Input id="deposit2" placeholder="0.00" className="bg-gray-800 border-gray-700 pl-8" />
                            </div>
                          </div>
                        </div>

                        <div className="bg-blue-500/10 border border-blue-600 rounded-lg p-4">
                          <p className="text-blue-400 text-sm">
                            Don't see the deposits yet? They typically appear within 1-2 business days. You can come
                            back to this page anytime to complete verification.
                          </p>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-between pb-6">
                      <Button
                        variant="outline"
                        onClick={() => router.push("/profile")}
                        className="bg-gray-800 border-gray-700"
                      >
                        I'll Verify Later
                      </Button>
                      <Button
                        onClick={handleVerify}
                        disabled={isSubmitting}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black"
                      >
                        {isSubmitting ? "Verifying..." : "Verify Deposits"}
                      </Button>
                    </CardFooter>
                  </Card>
                )}

                {step === "success" && (
                  <Card className="bg-gray-900 border-gray-800 mb-32">
                    {" "}
                    {/* Increased bottom margin */}
                    <CardHeader>
                      <CardTitle className="text-center">Account Connected Successfully!</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center">
                      <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
                      <p className="text-center text-lg mb-2">
                        Your bank account has been successfully connected and verified.
                      </p>
                      <p className="text-center text-gray-400 mb-6">
                        Your prize winnings of $125.00 will be transferred to your account within 3-5 business days.
                      </p>

                      <div className="bg-gray-800 p-4 rounded-lg w-full max-w-md">
                        <h3 className="font-medium mb-2">Connected Account</h3>
                        <p>
                          <span className="text-gray-400">Account Type:</span>{" "}
                          {bankMethod === "ach" ? "Bank Account (ACH)" : "Debit Card"}
                        </p>
                        <p>
                          <span className="text-gray-400">Account Name:</span> {formData.accountName}
                        </p>
                        <p>
                          <span className="text-gray-400">
                            {bankMethod === "ach" ? "Account Number:" : "Card Number:"}
                          </span>{" "}
                          ••••{formData.accountNumber.slice(-4)}
                        </p>
                      </div>
                    </CardContent>
                    <CardFooter className="flex justify-center pb-6">
                      <Button onClick={handleFinish} className="bg-yellow-500 hover:bg-yellow-600 text-black">
                        Return to Profile
                      </Button>
                    </CardFooter>
                  </Card>
                )}
              </div>
            </div>
          </main>
        </div>
      </GlobalScrollContainer>

      <MobileBottomNav />
    </div>
  )
}
