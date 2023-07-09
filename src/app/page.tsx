import LoginForm from '@/components/page specific/login/loginForm';

/* Homepage for a user to either sign in or sign up */
export default async function Home(props: any) {
  return (
    <div className="bg-cover bg-center h-screen bg-login-page flex items-center justify-center">
      <LoginForm />
    </div>
  )
}
