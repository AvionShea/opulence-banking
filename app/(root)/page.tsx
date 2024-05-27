import HeaderBox from '@/components/HeaderBox';
import RightSidebar from '@/components/RightSidebar';
import TotalBalanceBox from '@/components/TotalBalanceBox';
import { getLoggedInUser } from '@/lib/actions/user.actions';

const Dashboard = async () => {
  const loggedIn = await getLoggedInUser();
  return (
    <section className="dashboard">
      <div className='dashboard-content'>
        <header className='dashboard-header'>
          <HeaderBox
            type="greeting"
            title="Welcome,"
            user={loggedIn?.name + "!" || "Guest!"}
            subtext="Access and manage your account and transactions efficiently."
          />
          <TotalBalanceBox
            accounts={[]}
            totalBanks={3}
            totalCurrentBalance={134986.23}
          />
        </header>

        RECENT TRANSACTIONS

      </div>

      <RightSidebar
        user={loggedIn}
        transactions={[]}
        banks={[{}, {}]}
      />

    </section>
  )
};

export default Dashboard