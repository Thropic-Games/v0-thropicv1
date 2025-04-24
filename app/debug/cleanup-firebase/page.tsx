import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function CleanupFirebasePage() {
  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Firebase Cleanup Complete</CardTitle>
          <CardDescription>
            Firebase has been removed from this project. All authentication and database operations now use Supabase.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">The following Firebase components have been removed:</p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Firebase Authentication</li>
            <li>Firestore Database</li>
            <li>Firebase Storage</li>
            <li>Firebase Functions</li>
            <li>Firebase Hosting</li>
          </ul>
          <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 rounded-md">
            <h3 className="font-medium text-amber-800 dark:text-amber-400">Migration Complete</h3>
            <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
              All Firebase dependencies have been replaced with Supabase equivalents.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <p className="text-xs text-muted-foreground">
            If you encounter any issues, please check the Supabase documentation or contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}
