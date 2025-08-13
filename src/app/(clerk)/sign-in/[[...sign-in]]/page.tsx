"use client";

import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";

import { SiteConfig } from "~/config/site";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignInPage() {
  return (
    <SignIn.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <>
            <SignIn.Step name="start">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-lg font-bold">T</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    Welcome back
                  </CardTitle>
                  <CardDescription>
                    Sign in to your {SiteConfig.title} account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <Clerk.Connection name="github" asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={isGlobalLoading}
                        className="w-full"
                      >
                        <Clerk.Loading scope="provider:github">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.gitHub className="mr-2 size-4" />
                                GitHub
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                    <Clerk.Connection name="google" asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        type="button"
                        disabled={isGlobalLoading}
                        className="w-full"
                      >
                        <Clerk.Loading scope="provider:google">
                          {(isLoading) =>
                            isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              <>
                                <Icons.google className="mr-2 size-4" />
                                Google
                              </>
                            )
                          }
                        </Clerk.Loading>
                      </Button>
                    </Clerk.Connection>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background text-muted-foreground px-2">
                        Or continue with email
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Clerk.Field name="identifier" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label htmlFor="email">Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input id="email" placeholder="Enter your email" />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-destructive text-sm" />
                    </Clerk.Field>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <SignIn.Action submit asChild>
                    <Button
                      disabled={isGlobalLoading}
                      className="w-full"
                      size="sm"
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            "Continue"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>

                  <div className="text-muted-foreground text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link
                      href="/sign-up"
                      className="hover:text-primary font-medium underline underline-offset-4"
                    >
                      Sign up
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </SignIn.Step>

            <SignIn.Step name="choose-strategy">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-lg font-bold">T</span>
                    </div>
                  </div>
                  <CardTitle>Choose verification method</CardTitle>
                  <CardDescription>
                    Select how you&apos;d like to verify your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <SignIn.SupportedStrategy name="email_code" asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isGlobalLoading}
                      className="w-full justify-start"
                    >
                      <Icons.mail className="mr-2 size-4" />
                      Email verification code
                    </Button>
                  </SignIn.SupportedStrategy>
                  <SignIn.SupportedStrategy name="password" asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isGlobalLoading}
                      className="w-full justify-start"
                    >
                      <Icons.lock className="mr-2 size-4" />
                      Password
                    </Button>
                  </SignIn.SupportedStrategy>
                </CardContent>
                <CardFooter>
                  <SignIn.Action navigate="previous" asChild>
                    <Button
                      variant="outline"
                      disabled={isGlobalLoading}
                      className="w-full"
                    >
                      <Clerk.Loading>
                        {(isLoading) => {
                          return isLoading ? (
                            <Icons.spinner className="size-4 animate-spin" />
                          ) : (
                            "Go back"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignIn.Action>
                </CardFooter>
              </Card>
            </SignIn.Step>

            <SignIn.Step name="verifications">
              <SignIn.Strategy name="password">
                <Card className="w-full">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                        <span className="text-lg font-bold">T</span>
                      </div>
                    </div>
                    <CardTitle>Enter your password</CardTitle>
                    <CardDescription>
                      Welcome back{" "}
                      <span className="font-medium">
                        <SignIn.SafeIdentifier />
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Clerk.Field name="password" className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Clerk.Label asChild>
                          <Label htmlFor="password">Password</Label>
                        </Clerk.Label>
                        <Link
                          href="/forgot-password"
                          className="hover:text-primary text-sm underline underline-offset-4"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <Clerk.Input type="password" asChild>
                        <Input
                          id="password"
                          placeholder="Enter your password"
                        />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-destructive text-sm" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <SignIn.Action submit asChild>
                      <Button disabled={isGlobalLoading} className="w-full">
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              "Sign in"
                            );
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignIn.Action>
                    <SignIn.Action navigate="choose-strategy" asChild>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="w-full"
                      >
                        Use another method
                      </Button>
                    </SignIn.Action>
                  </CardFooter>
                </Card>
              </SignIn.Strategy>

              <SignIn.Strategy name="email_code">
                <Card className="w-full">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                        <span className="text-lg font-bold">T</span>
                      </div>
                    </div>
                    <CardTitle>Check your email</CardTitle>
                    <CardDescription>
                      We sent a verification code to{" "}
                      <span className="font-medium">
                        <SignIn.SafeIdentifier />
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Clerk.Field name="code">
                      <Clerk.Label className="sr-only">
                        Email verification code
                      </Clerk.Label>
                      <div className="flex justify-center">
                        <Clerk.Input
                          type="otp"
                          autoSubmit
                          className="flex justify-center has-[:disabled]:opacity-50"
                          render={({ value, status }) => {
                            return (
                              <div
                                data-status={status}
                                className="border-input data-[status=cursor]:ring-ring data-[status=selected]:ring-ring relative flex h-10 w-10 items-center justify-center border text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=cursor]:ring-2 data-[status=selected]:ring-2"
                              >
                                {value}
                              </div>
                            );
                          }}
                        />
                      </div>
                      <Clerk.FieldError className="text-destructive text-center text-sm" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <SignIn.Action submit asChild>
                      <Button disabled={isGlobalLoading} className="w-full">
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              "Verify code"
                            );
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignIn.Action>

                    <SignIn.Action
                      asChild
                      resend
                      fallback={({ resendableAfter }) => (
                        <Button
                          variant="ghost"
                          size="sm"
                          disabled
                          className="w-full"
                        >
                          Resend code in {resendableAfter}s
                        </Button>
                      )}
                    >
                      <Button variant="ghost" size="sm" className="w-full">
                        Resend code
                      </Button>
                    </SignIn.Action>

                    <SignIn.Action navigate="choose-strategy" asChild>
                      <Button size="sm" variant="ghost" className="w-full">
                        Use another method
                      </Button>
                    </SignIn.Action>
                  </CardFooter>
                </Card>
              </SignIn.Strategy>
            </SignIn.Step>
          </>
        )}
      </Clerk.Loading>
    </SignIn.Root>
  );
}
