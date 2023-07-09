import Tray from "@/components/page specific/tribeDashboard/tray"
import AppProvider from "@/utils/contexts/App"
import NotificationProvider from "@/utils/contexts/Notification";

export const metadata = {
  title: 'Tribe | Dashboard',
  description: 'Tribe dashboard',
}

interface Props {
  children: React.ReactNode;
  params: {
    userId: string;
    slug: string;
  }
}

export default function AppLayout(props: Props) {
  const { children, params: { userId, slug } } = props

  return (
    <div className="w-full flex flex-row">
      <AppProvider userId={userId}>
        <NotificationProvider tribeId={slug} >
          <Tray />
          <div className="w-full bg-backgroundGrey">
            {children}
          </div>
        </NotificationProvider>
      </AppProvider>
    </div>
  )
}