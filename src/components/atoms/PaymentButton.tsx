"use client";

import React from "react";

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
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

type PaymentModalProps = {
  planId: number;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
};

export default function PaymentButton({
  children,
  plan,
}: PaymentButtonProps): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { user } = useUserStore();
  
  const handleOpen = () => {
    onOpen();
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {selectedPlan?.name}
              </ModalHeader>
              <ModalBody>
                <EmbeddedCheckoutProvider
                  stripe={stripePromise}
                  options={{
                    fetchClientSecret: () =>
                      fetchClientSecret(plan.stripe_price_id, user?.stripe_customer_id ?? ""),
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
