
export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Authentication Error</h1>
        <p className="mt-2 text-gray-600">
          Something went wrong logging you in. Please try again.
        </p>
        <a
          href="/login"
          className="mt-4 inline-block rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Back to Login
        </a>
      </div>
    </div>
  )
}
