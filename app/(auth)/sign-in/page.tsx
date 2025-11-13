import { getCurrent } from "@/app/features/auth/queries";
import SignInCard from "@/app/features/auth/components/sign-in-card";
import { redirect } from "next/navigation";

const SignInPage = async () => {
  const user = await getCurrent();

  console.log({ user });

  if (user) redirect("/");

  return <SignInCard />;
};

export default SignInPage;
