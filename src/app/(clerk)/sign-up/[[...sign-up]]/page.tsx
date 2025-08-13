"use client";

import Link from "next/link";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";

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

export default function SignUpPage() {
  return (
    <SignUp.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
          <>
            <SignUp.Step name="start">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-lg font-bold">T</span>
                    </div>
                  </div>
                  <CardTitle className="text-2xl font-semibold">
                    Create your account
                  </CardTitle>
                  <CardDescription>
                    Join {SiteConfig.title} and start organizing your tasks
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
                    <Clerk.Field name="emailAddress" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label htmlFor="email">Email address</Label>
                      </Clerk.Label>
                      <Clerk.Input type="email" required asChild>
                        <Input id="email" placeholder="Enter your email" />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-destructive text-sm" />
                    </Clerk.Field>

                    <Clerk.Field name="password" className="space-y-2">
                      <Clerk.Label asChild>
                        <Label htmlFor="password">Password</Label>
                      </Clerk.Label>
                      <Clerk.Input type="password" required asChild>
                        <Input id="password" placeholder="Create a password" />
                      </Clerk.Input>
                      <Clerk.FieldError className="text-destructive text-sm" />
                    </Clerk.Field>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <SignUp.Action submit asChild>
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
                            "Create account"
                          );
                        }}
                      </Clerk.Loading>
                    </Button>
                  </SignUp.Action>

                  <div className="text-muted-foreground text-center text-sm">
                    Already have an account?{" "}
                    <Link
                      href="/sign-in"
                      className="hover:text-primary font-medium underline underline-offset-4"
                    >
                      Sign in
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </SignUp.Step>

            <SignUp.Step name="continue">
              <Card className="w-full">
                <CardHeader className="text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                      <span className="text-lg font-bold">T</span>
                    </div>
                  </div>
                  <CardTitle>Complete your profile</CardTitle>
                  <CardDescription>
                    Tell us a bit more about yourself
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Clerk.Field name="firstName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label htmlFor="firstName">First name</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                      />
                    </Clerk.Input>
                    <Clerk.FieldError className="text-destructive text-sm" />
                  </Clerk.Field>

                  <Clerk.Field name="lastName" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label htmlFor="lastName">Last name</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input id="lastName" placeholder="Enter your last name" />
                    </Clerk.Input>
                    <Clerk.FieldError className="text-destructive text-sm" />
                  </Clerk.Field>

                  <Clerk.Field name="username" className="space-y-2">
                    <Clerk.Label asChild>
                      <Label htmlFor="username">Username</Label>
                    </Clerk.Label>
                    <Clerk.Input type="text" required asChild>
                      <Input id="username" placeholder="Choose a username" />
                    </Clerk.Input>
                    <Clerk.FieldError className="text-destructive text-sm" />
                  </Clerk.Field>
                </CardContent>
                <CardFooter>
                  <SignUp.Action submit asChild>
                    <Button disabled={isGlobalLoading} className="w-full">
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
                  </SignUp.Action>
                </CardFooter>
              </Card>
            </SignUp.Step>

            <SignUp.Step name="verifications">
              <SignUp.Strategy name="email_code">
                <Card className="w-full">
                  <CardHeader className="text-center">
                    <div className="mb-4 flex justify-center">
                      <div className="bg-primary text-primary-foreground flex h-12 w-12 items-center justify-center rounded-lg">
                        <span className="text-lg font-bold">T</span>
                      </div>
                    </div>
                    <CardTitle>Verify your email</CardTitle>
                    <CardDescription>
                      We sent a verification code to your email address
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
                          className="flex justify-center has-[:disabled]:opacity-50"
                          autoSubmit
                          render={({ value, status }) => {
                            return (
                              <div
                                data-status={status}
                                className="border-input data-[status=cursor]:ring-ring data-[status=selected]:ring-ring relative flex h-10 w-10 items-center justify-center border text-sm transition-all first:rounded-l-md first:border-l last:rounded-r-md data-[status=cursor]:ring-2 data-[status=selected]:ring-2"
                              >
                                {value}
                                {status === "cursor" && (
                                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                                    <div className="animate-caret-blink bg-foreground h-4 w-px duration-1000" />
                                  </div>
                                )}
                              </div>
                            );
                          }}
                        />
                      </div>
                      <Clerk.FieldError className="text-destructive text-center text-sm" />
                    </Clerk.Field>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3">
                    <SignUp.Action submit asChild>
                      <Button disabled={isGlobalLoading} className="w-full">
                        <Clerk.Loading>
                          {(isLoading) => {
                            return isLoading ? (
                              <Icons.spinner className="size-4 animate-spin" />
                            ) : (
                              "Verify email"
                            );
                          }}
                        </Clerk.Loading>
                      </Button>
                    </SignUp.Action>

                    <SignUp.Action
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
                        Resend verification code
                      </Button>
                    </SignUp.Action>
                  </CardFooter>
                </Card>
              </SignUp.Strategy>
            </SignUp.Step>
          </>
        )}
      </Clerk.Loading>
    </SignUp.Root>
  );
}
