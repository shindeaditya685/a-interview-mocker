"use client";

import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

const SignUpPage = () => {
  return (
    <section className="bg-white">
      <div className="lg:grid lg:min-h-screen lg:grid-cols-12">
        {/* Background Image Section */}
        <section className="relative flex h-32 items-end bg-gray-900 lg:col-span-5 lg:h-full xl:col-span-6">
          <Image
            src="https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80"
            alt="Sign-in background"
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            width={1024}
            height={1024}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

          <div className="relative z-10 hidden lg:block lg:p-12">
            <h2 className="mt-6 text-4xl font-extrabold text-white sm:text-5xl">
              Welcome to AI Interview Mocker 🤖
            </h2>
            <p className="mt-4 text-lg text-white/90 leading-relaxed">
              Get ready to practice your interview skills with our AI-powered
              mock interviews.
            </p>
          </div>
        </section>

        {/* Sign-Up Form Section */}
        <main className="flex items-center justify-center px-8 py-16 bg-gray-50 sm:px-12 lg:col-span-7 lg:px-16 lg:py-24 xl:col-span-6">
          <div className="max-w-lg lg:max-w-3xl">
            <div className="relative mb-8 block lg:hidden">
              <a
                href="#"
                className="inline-flex items-center justify-center p-3 text-blue-600 bg-white rounded-full shadow-lg hover:shadow-xl"
              >
                <span className="sr-only">Home</span>
              </a>
            </div>

            <SignUp
              afterSignOutUrl="/sign-in"
              className="rounded-lg shadow-lg bg-white p-8 lg:p-10"
            />
          </div>
        </main>
      </div>
    </section>
  );
};

export default SignUpPage;
