import { yupResolver } from "@hookform/resolvers/yup";
import {
  IconBrandGithub,
  IconNotebook,
  IconReload,
  IconUsers,
} from "@tabler/icons";
import axios from "axios";
import { motion } from "framer-motion";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import card from "/gradient.svg";
import background from "/pattern.png";

interface IFormInput {
  search: string;
}

interface IRepo {
  name: string;
  svn_url: string;
}

interface IRepos {
  name: string;
  followers: number;
  public_repos: number;
  login: string;
  avatar_url: string;
  repos_url: string;
  repos: IRepo[];
}

const schema = yup
  .object()
  .shape({
    search: yup.string().required("Search is required"),
  })
  .required();

function App() {
  const [data, setData] = useState<IRepos | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    register,
  } = useForm<IFormInput>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: IFormInput) => {
    try {
      setIsLoading(true);
      const { data: githubData } = await axios.get(
        `https://api.github.com/users/${data.search}`
      );

      const result: IRepos = githubData;
      const { data: githubRepo } = await axios.get(result.repos_url);

      setData({ ...result, repos: githubRepo.reverse().slice(0, 3) });
    } catch (error) {
      setError("search", {
        type: "manual",
        message: "User not found",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
      }}
      className="flex flex-col w-full min-h-screen justify-center items-center "
    >
      {data === null ? (
        <motion.form
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, type: "spring", bounce: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          className={`flex items-center justify-center border-[0.2rem] rounded-lg border-[#7D5DD8] relative h-14`}
        >
          <div className="text-[#7D5DD8] absolute -top-12">
            <IconBrandGithub size={52} stroke={1.5} />
          </div>
          <input
            {...register("search", { required: true })}
            type="text"
            className="h-full py-2 px-4 bg-[#0B0B0F] rounded-l-md focus:outline-0 font-outfit text-white"
            placeholder="Username"
            autoFocus
          />
          {errors.search && (
            <p className="absolute text-red-500 text-sm font-bold -bottom-8">
              {errors.search.message}
            </p>
          )}
          <div className="font-syne h-14 w-full bg-[#7D5DD8] rounded-r-md">
            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center gap-2 disabled:text-[#5c42a6]  font-syne h-full w-full px-6 rounded-lgtransition-all duration-200 ease-in-out font-semibold text-white rounded-tr-sm rounded-br-sm active:scale-90 "
            >
              {isLoading && <IconReload size={18} className="animate-spin" />}
              SEARCH
            </button>
          </div>
        </motion.form>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0, translateY: 100, skewY: 10 }}
            animate={{ opacity: 1, scale: 1, translateY: 0, skewY: 0 }}
            transition={{ duration: 1, type: "spring", bounce: 0 }}
            className="flex flex-col items-center bg-[#252538] max-w-[400px] w-11/12 h-[650px] border-2 border-[#7D5DD8] rounded-xl relative"
          >
            <div className="flex flex-col w-full rounded-t-lg h-64 relative items-center justify-center font-outfit">
              <p className="z-10  relative mt-16 mb-8 font-bold text-xl text-white">
                {data?.login}
              </p>
              <motion.img
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, type: "spring", bounce: 0.5 }}
                src={data?.avatar_url}
                alt="avatar"
                className="rounded-full w-52 h-52 border-[#7D5DD8] border-2 z-10  relative select-none"
              />
              <img
                src={card}
                alt="card"
                className=" absolute top-0 rounded-t-lg select-none"
              />
            </div>
            <h1 className="text-white font-bold text-2xl mt-16 font-outfit w-11/12 text-center">
              {data?.name}
            </h1>
            <div className="flex w-9/12 mt-6 text-[#7D5DD8] items-center justify-center gap-4">
              <button className="flex font-bold gap-5 py-2 px-4 rounded-md border-[#7D5DD8] border-2 bg-[#7D5DD8]/30 font-outfit">
                {data?.followers}
                <IconUsers />
              </button>

              <button className="flex font-bold gap-5 py-2 px-4 rounded-md border-[#7D5DD8] border-2 bg-[#7D5DD8]/30 font-outfit">
                {data?.public_repos}
                <IconNotebook />
              </button>
            </div>

            <div className="mt-4 flex flex-col items-center">
              {data?.repos.map((repo) => (
                <a
                  key={repo.name}
                  href={repo.svn_url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex font-semibold gap-5 py-2 text-white font-syne"
                >
                  {repo.name}
                </a>
              ))}
            </div>
            <div className="text-[#7D5DD8] absolute -bottom-[6px]">
              <a href="https://github.com/TiagoGP-exe">
                <IconBrandGithub size={48} stroke={1.5} />
              </a>
            </div>
          </motion.div>
          <button
            onClick={() => {
              setData(null);
              reset();
            }}
            className="font-syne py-2 px-8 bg-[#7D5DD8] rounded-md transition-all duration-200 ease-in-out font-semibold text-white active:scale-90 mt-6"
          >
            ANOTHER SEARCH
          </button>
        </>
      )}
    </div>
  );
}

export default App;
