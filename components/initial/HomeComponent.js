import React from "react";
import tw from "twin.macro";
import Link from "next/link";
import LoggedArea from "../layout/LoggedArea";
import Layout from "../layout/Layout";
import WelcomeBanner from "../utilities/WelcomeBanner";

const HomeComponent = () => {
  return (
    <LoggedArea>
      <Layout header={{ title: "Dashboard" }}>
        <WelcomeBanner />
        <div tw="grid grid-cols-1 sm:grid-cols-2 pt-10">
          <div>
            <div tw="max-w-[29rem] py-4 px-5 bg-white shadow-lg rounded-lg my-20 mt-2">
              <div tw="flex justify-center md:justify-end -mt-16">
                <img
                  tw="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                  src="/images/tasks.png"
                />
              </div>
              <div>
                <h2 tw="text-gray-800 text-3xl font-semibold">Daftar Tugas</h2>
                <p tw="mt-2 text-gray-600">
                  Manajemen data sekolah online yang memiliki beragam fitur
                  yakni belajar mengajar yang dilakukan secara online
                </p>
              </div>
              <div tw="flex justify-end mt-4">
                <div tw="text-xl font-medium text-indigo-500">
                  <Link href="/task">Daftar Tugas</Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div tw="max-w-[29rem] py-4 px-5 bg-white shadow-lg rounded-lg my-20 mt-2">
              <div tw="flex justify-center md:justify-end -mt-16">
                <img
                  tw="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                  src="/images/student.png"
                />
              </div>
              <div>
                <h2 tw="text-gray-800 text-3xl font-semibold">Daftar Siswa</h2>
                <p tw="mt-2 text-gray-600">
                  Manajemen dan registrasi data siswa kini semakin mudah hanya
                  cukup dirumah saja
                </p>
              </div>
              <div tw="flex justify-end mt-4">
                <div tw="text-xl font-medium text-indigo-500">
                  <Link href="/student">Daftar Siswa</Link>
                </div>
              </div>
            </div>
          </div>
          <div>
            <div tw="max-w-[29rem] py-4 px-5 bg-white shadow-lg rounded-lg my-20 mt-2">
              <div tw="flex justify-center md:justify-end -mt-16">
                <img
                  tw="w-20 h-20 object-cover rounded-full border-2 border-indigo-500"
                  src="/images/teacher.png"
                />
              </div>
              <div>
                <h2 tw="text-gray-800 text-3xl font-semibold">Daftar Guru</h2>
                <p tw="mt-2 text-gray-600">
                  Manajemen dan registrasi data guru kini semakin mudah hanya
                  cukup dirumah saja
                </p>
              </div>
              <div tw="flex justify-end mt-4">
                <div tw="text-xl font-medium text-indigo-500">
                  <Link href="/student">Daftar Guru</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    </LoggedArea>
  );
};

export default HomeComponent;
