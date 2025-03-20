import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Button,
  RadioGroup,
  Radio,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import VestiqLogo from "@/components/atoms/VestiqLogo";
import Image from "next/image";
import { CloseOutlined } from "@mui/icons-material";
import { usePlanStore } from "@/stores";

export default function UpgradePlanModal() {
  const [selectedPlan, setSelectedPlan] = useState<string>("monthly");
  const { isOpenUpgradeModal, setIsOpenUpgradeModal } = usePlanStore();

  const handlePlanChange = (value: string) => {
    setSelectedPlan(value);
  };

  const features = [
    "Grow fans and followers on multiple social platforms",
    "Promote more content with email automation",
    "Showcase your content to thousands of fans in New Finds",
  ];

  return (
    <Modal
      isOpen={isOpenUpgradeModal}
      onClose={() => setIsOpenUpgradeModal(false)}
      placement="center"
      size="lg"
      backdrop="blur"
      hideCloseButton
    >
      <ModalContent className="rounded-xl select-none">
        <ModalHeader className="h-56 relative flex-col items-center justify-center gap-6">
          <Button
            isIconOnly
            className="absolute right-2 top-2 z-[2]"
            radius="full"
            size="sm"
            variant="light"
            onPress={() => setIsOpenUpgradeModal(false)}
          >
            <CloseOutlined fontSize="small" />
          </Button>
          <Image
            src={"/images/banners/bg-example.png"}
            width={100}
            height={100}
            alt="redraw banner background"
            className="w-full h-full object-cover absolute z-0"
            unoptimized
            priority
          />
          <div className="absolute inset-0 z-[1]"></div>
          <VestiqLogo className="w-20 relative z-[2]" />
          <div className="w-5/6 flex-col text-white text-center mx-auto relative z-[2]">
            <h2 className="text-xl font-semibold mb-2">
              Expand your brand and sell more!
            </h2>
            <p className=" text-sm font-normal">
              Access advanced Vestiq PRO tools to showcase your collection and
              attract more customers.
            </p>
          </div>
        </ModalHeader>
        <ModalBody className="gap-6">
          <RadioGroup
            label="Select your plan"
            className="w-full"
            value={selectedPlan}
            onChange={(e) => handlePlanChange(e.target.value)}
          >
            <nav className="w-full flex gap-2">
              <div
                className={`w-full border-2 rounded-lg p-3 ${
                  selectedPlan === "monthly" ? "border-secondary" : ""
                }`}
              >
                <Radio value="monthly" color="secondary">
                  Monthly
                </Radio>
              </div>

              <div
                className={`w-full flex justify-between items-center text-sm border-2 rounded-lg p-3 relative ${
                  selectedPlan === "annual" ? "border-secondary" : ""
                }`}
              >
                <Radio value="annual" color="secondary">
                  Annual
                </Radio>
                <span className="bg-black text-white text-xs px-1.5 py-0.5 rounded-md">
                  BEST VALUE
                </span>
              </div>
            </nav>
          </RadioGroup>

          <div className="w-full mb-3">
            <h3 className="font-medium mb-3">What you get</h3>
            <ul className="space-y-3">
              {features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <div className="bg-black text-white rounded-full p-1 mr-3 flex-shrink-0">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </ModalBody>
        <ModalFooter className="flex items-center justify-between border-t">
          <div className="">
            <p className="text-3xl font-bold inline-block">$8</p>
            <span className="text-gray-600 text-sm ml-1">
              /mo (billed monthly)
            </span>
          </div>
          <Button color="secondary" size="lg" radius="sm">
            Upgrade to Pro
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
