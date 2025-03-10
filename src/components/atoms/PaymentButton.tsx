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

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
);

type PaymentButtonProps = {
  children: React.ReactNode;
  plan: Plan;
};

export default function PaymentButton({
  children,
  plan,
}: PaymentButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <div className="flex flex-wrap gap-3 ">
        <Button
          className={`${
            plan.key === "expert"
              ? "bg-secondary text-white"
              : "bg-white text-secondary"
          } h-[52px] p-[20px] flex items-center justify-center font-inter text-lg leading-[28px] font-normal rounded-[12px] mt-4 mb-2 mr-auto ml-auto border border-secondary`}
          onPress={() => handleOpen()}
        >
          {children}
        </Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {plan.name}
              </ModalHeader>
              <ModalBody>
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret: () =>
                      fetchClientSecret(plan.stripe_price_id),
                  }}
                >
                  <EmbeddedCheckout />
                </EmbeddedCheckoutProvider>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
