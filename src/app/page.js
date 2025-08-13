// import { useRouter } from "next/navigation";
import Homepage from "./components/Homepage";

export default function page() {

    return (
      <div>
        {/* <div className="p-6">
        <p>You are not signed in.</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Sign in with Google
        </button>
      </div> */}
      <Homepage/>
      </div>
    );
  }

  // return (
  //  <div>
  //    <div className="p-6">
  //     <p>Welcome, {session.user.name}</p>
  //     <button
  //       onClick={() => signOut({ callbackUrl: "/" })}
  //       className="bg-red-500 text-white px-4 py-2 rounded"
  //     >
  //       Logout
  //     </button>
  //   </div>
  //   <Homepage/>
  //  </div>
  // );
