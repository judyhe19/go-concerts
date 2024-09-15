"use client";
import { signInAction } from "@/actions/auth-action";
import { Button } from "@/components/ui/button";
import todovexLogo from "@/public/logo/todovex.svg";
// import micdrop from "@/public/logo/mic-drop.png";
import clsx from "clsx";
import { Loader, StepForward } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useFormStatus } from "react-dom";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { debounce } from "lodash";
import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";
import SpotifyLogin from "@/components/spotify/spotify-auth";

interface Attraction {
  name: string;
  id: string;
  url: string;
  images: {
    ratio: string;
    url: string;
    width: number;
    height: number;
    fallback: boolean;
  }[];
}

export default function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [attractions, setAttractions] = useState<Attraction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const fetchAttractions = async (searchKeyword: string) => {
    setLoading(true);
    setError(null);

    const baseUrl = "https://app.ticketmaster.com/discovery/v2/attractions";
    const apiKey = "2SkTVj4HZ45flNjJiC8CrgfVJsnz5zV3";
    const url = `${baseUrl}?apikey=${apiKey}&keyword=${searchKeyword}`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const fetchedAttractions = data._embedded?.attractions || [];
      setAttractions(fetchedAttractions);
      setShowDropdown(true);
    } catch (error) {
      console.error("Error fetching attractions:", error);
      setError("Failed to fetch attractions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce(fetchAttractions, 500);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    setKeyword(input);
    if (input.trim()) {
      debouncedFetch(input);
    } else {
      setAttractions([]);
      setShowDropdown(false);
    }
  };

  const handleSelectAttraction = (attraction: Attraction) => {
    setKeyword(attraction.name);
    setShowDropdown(false);
  };

  return (
    <main className="bg-gradient-to-tr from-pink-500 to-yellow-500 h-full min-h-screen">
      <div className="container relative m-0 mx-auto py-10 md:px-10">
        {/* Header */}
        <div className="max-width flex items-center justify-center lg:justify-between">
          <Link className="flex items-center gap-1" href="/">
            <h1 className="text-xl hidden lg:flex font-medium text-white md:text-3xl">
              goConcerts.io
            </h1>
          </Link>
          <div className="hidden lg:flex w-fit items-center">
            {/* <form action={signInAction}> */}
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
            <SpotifyLogin />
            
              <UserButton />
            </SignedIn>
 
            {/* </form> */}
          </div>
        </div>

        {/* Hero Section */}
        <div className="flex flex-col items-center p-6 space-y-6">
          <div className="flex h-full w-full flex-col items-center justify-center">
          <div className="">
              <div className="flex items-center justify-center py-12">
                <Image
                  alt="mobile"
                  loading="lazy"
                  width="250"
                  height="300"
                  className="z-10 max-w-[400px]"
                  src={"/waveform.png"}
                />
              </div>
            </div>
            <span
              rel="noreferrer"
              className="mb-6 cursor-pointer rounded-2xl border border-black px-4 py-1 text-xs text-slate-600 transition duration-300 ease-in-out hover:text-slate-700 sm:text-base text-center"
            >
              Powered by{" "}
              <a
                className="font-bold"
                target="_blank"
                href="https://www.convex.dev/"
              >
                Convex{" "}
              </a>
              and{" "}
              <a
                className="font-bold"
                target="_blank"
                href="https://suno.com/"
              >
                Suno AI ✨
              </a>
            </span>
            <h1 className="inline-block text-center text-4xl font-medium text-white lg:text-7xl">
              Music Near You
            </h1>
            <h2 className="mt-8 mb-8 text-center text-xl font-light text-white tracking-tight lg:text-3xl italic">
              goConcerts.io seamlessly{" "}
              <span className="font-bold px-1">compares ticket prices</span>{" "}
              <span className="font-bold px-1">suggests music matches</span>, and{" "}
              <span className="font-bold px-1">generate your own music using Suno AI!</span>
            </h2>

            {/* Search Bar */}
            <div className="relative w-full max-w-lg">
              <Input
                placeholder="Enter artist, location, etc."
                value={keyword}
                onChange={handleInputChange} // Update keyword state and fetch attractions
                className="w-full"
              />

              {/* Dropdown for search results */}
              {showDropdown && attractions.length > 0 && (
                <div className="absolute z-10 w-full bg-white border border-gray-300 rounded-lg shadow-lg mt-2 max-h-60 overflow-y-auto">
                  {attractions.map((attraction) => (
                    <div
                      key={attraction.id}
                      onClick={() => handleSelectAttraction(attraction)} // Handle item click
                      className="p-2 hover:bg-gray-200 cursor-pointer"
                    >
                      <p className="font-semibold">{attraction.name}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Loading and error handling */}
              {loading && <p className="text-white mt-2">Loading...</p>}
              {error && <p className="text-red-600 mt-2">{error}</p>}
            </div>

            {/* Selected Attraction Details */}
            {keyword && (
              <div className="w-full max-w-lg mt-6">
                {attractions.find(
                  (attraction) => attraction.name === keyword
                ) ? (
                  <Card className="shadow-lg">
                    <CardContent>
                      <CardTitle className="mt-4">{keyword}</CardTitle>
                      {attractions.find(
                        (attraction) => attraction.name === keyword
                      )?.images?.[0]?.url && (
                        <img
                          src={
                            attractions.find(
                              (attraction) => attraction.name === keyword
                            )?.images?.[0]?.url
                          }
                          alt={keyword}
                          className="mt-4 w-full h-auto rounded-lg"
                          style={{ maxHeight: "300px", objectFit: "cover" }}
                        />
                      )}
                      <a
                        href={
                          attractions.find(
                            (attraction) => attraction.name === keyword
                          )?.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline mt-2 block"
                      >
                        View Details
                      </a>
                    </CardContent>
                  </Card>
                ) : (
                  <p className="text-center"></p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

function SignInButton() {
  const { pending } = useFormStatus();

  return (
    <Link href={"/signIn"}>
      <button
        disabled={pending}
        className="relative inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-400 to-orange-400 group-hover:from-purple-400 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
      >
        <span
          className={clsx(
            "relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0",
            pending && "px-16"
          )}
        >
          {pending ? (
            <span className="">
              <Loader className="w-5 h-5" />
            </span>
          ) : (
            "Sign in"
          )}
        </span>
      </button>
    </Link>
  );
}
