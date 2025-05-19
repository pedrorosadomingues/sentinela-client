"use client";

import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";

import { loadStripe } from "@stripe/stripe-js";

import { fetchClientSecret } from "@/services/stripe";

import {
  EmbeddedCheckout,
  EmbeddedCheckoutProvider,
} from "@stripe/react-stripe-js";

import { Plan } from "@/interfaces";

import { useUserStore } from "@/stores";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

type OpenCheckoutButtonProps = {
  children: React.ReactNode;
  plan: Plan;
};

export default function OpenCheckoutButton({
  children,
  plan,
}: OpenCheckoutButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useUserStore();

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 ">
        <Button
          className={`${
            plan?.key === "expert"
              ? "bg-secondary-foreground font-medium text-secondary shadow-sm shadow-default-500/50"
              : "bg-white text-secondary"
          } h-[52px] p-[20px] flex items-center justify-center font-inter text-lg leading-[28px] font-normal rounded-[12px] mt-4 mb-2 mr-auto ml-auto border border-secondary`}
          onPress={() => handleOpen()}
        >
          {children}
        </Button>
      </div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        size="xl"
        className="bg-black rounded-lg mt-[600px] h-[800px] overflow-y-auto"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalBody >
                <ModalHeader className="bg-black">
                  <h2 className="text-white text-2xl font-bold">
                    {plan?.name}
                  </h2>
                </ModalHeader>
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret: () =>
                      fetchClientSecret(
                        plan.stripe_price_id,
                        user?.stripe_customer_id ?? ""
                      ),
                  }}
                >
                  <EmbeddedCheckout className="bg-black rounded-lg" />
                </EmbeddedCheckoutProvider>
              </ModalBody>
              <ModalFooter className="bg-black">
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
