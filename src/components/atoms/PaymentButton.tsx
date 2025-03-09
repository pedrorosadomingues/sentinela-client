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
      <div className="flex flex-wrap gap-3">
        <Button onPress={() => handleOpen()}>{children}</Button>
      </div>
      <Modal isOpen={isOpen} onClose={onClose}>
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
