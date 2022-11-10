import { GetServerSideProps, GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { parse } from "cookie";
import { PrismaClient } from "@prisma/client";
import { fetcher } from "../shared/fetcher";
import { useRouter } from "next/router";

const prisma = new PrismaClient();
export default function Main(props: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const handleLogout = async () => {
    await fetcher("/auth/logout");
    router.replace("/login");
  };
  return (
    <main className="grid place-items-center">
      <h1 className="text-3xl text-white">I am :</h1>
      <p className="text-white text-lg">{JSON.stringify(props)}</p>
      <button className="bg-purple-600 px-4 py-2 rounded-md font-semibold mt-4" onClick={handleLogout}>
        logout
      </button>
    </main>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const cookies = parse(context.req.headers.cookie ?? "");
  const userId = cookies["mbb"];
  const user = await prisma.user.findUnique({ where: { id: parseInt(userId) } });

  return {
    props: { username: user?.username, id: user?.id, email: user?.email }, // will be passed to the page component as props
  };
}
