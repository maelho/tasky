"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import * as Clerk from "@clerk/elements/common";
import * as SignUp from "@clerk/elements/sign-up";
import { useOrganization, useUser } from "@clerk/nextjs";

import { SiteConfig, Paths } from "~/config/site";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Icons } from "~/components/ui/icons";

export default function SignUpPage() {
  const router = useRouter();
  const { isSignedIn } = useUser();
  const { organization } = useOrganization();

  useEffect(() => {
    if (!isSignedIn) return;
    if (organization?.id) {
      router.replace(`${Paths.Organization}/${organization.id}`);
    } else {
      router.replace(Paths.SelectOrg);
    }
  }, [isSignedIn, organization?.id, router]);

  return (
    <SignUp.Root>
      <Clerk.Loading>
        {(isGlobalLoading) => (
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
            </CardContent>
          </Card>
        )}
      </Clerk.Loading>
    </SignUp.Root>
  );
}
