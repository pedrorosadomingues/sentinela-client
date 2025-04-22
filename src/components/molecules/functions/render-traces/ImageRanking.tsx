import { useFnStore } from "@/stores/fnStore";
import {
  InfoOutlined,
  SchoolOutlined,
  SpeedOutlined,
} from "@mui/icons-material";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  useDisclosure,
  Button,
  ProgressVariantProps,
  Progress,
  CircularProgress,
  ScrollShadow,
  Link,
} from "@nextui-org/react";
import { Accordion, AccordionItem } from "@nextui-org/react";
import { useTranslations } from "next-intl";

interface ChartOptions {
  limit: number;
  color: ProgressVariantProps["color"];
  fill: string;
}

export default function ImageRanking({ isDisabled }: { isDisabled: boolean }) {
  const t = useTranslations("image-score");
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { currentImageScore } = useFnStore();
  const sliders = currentImageScore?.sliders;
  const parameters = currentImageScore?.parameters;
  const baseURL = window.location.origin;
  const percent = 23;

  const valueColorMap = (value: number): ChartOptions => {
    const ranges: ChartOptions[] = [
      { limit: 3, color: "danger", fill: "bg-danger" },
      { limit: 6, color: "warning", fill: "bg-warning" },
      { limit: 9, color: "primary", fill: "bg-primary" },
      { limit: 10, color: "success", fill: "bg-success" },
    ];

    // Busca o intervalo correto, com fallback para sucesso
    return (
      ranges.find((r) => value < r.limit) || {
        limit: 10,
        color: "success",
        fill: "bg-success",
      }
    );
  };

  const chart = {
    title: t("final_score_slider"),
    color: valueColorMap(percent).color,
    total: 10,
    current: sliders?.average_score.toFixed() || 0,
    categories: [
      {
        key: "lightning",
        name: t("lightning_slider.title"),
        value: sliders?.light_score?.toFixed() || 0,
        videoUrl: "classroom/1/4",
        message:
          parameters?.mean_intensity !== undefined &&
          (parameters.mean_intensity > 180
            ? t("lightning_slider.too_bright")
            : parameters.mean_intensity < 80
            ? t("lightning_slider.too_dark")
            : t("lightning_slider.just_right")),
      },
      {
        key: "border",
        name: t("border_slider.title"),
        value: sliders?.border_score?.toFixed() || 0,
        videoUrl: "classroom/1/2",
        message:
          parameters?.border_area !== undefined && parameters.border_area > 5
            ? t("border_slider.too_visible")
            : t("border_slider.good"),
      },
      {
        key: "resolution",
        name: t("resolution_slider.title"),
        value: sliders?.resolution?.toFixed() || 0,
        videoUrl: "classroom/1/3",
        message:
          parameters?.image_res !== undefined &&
          parameters.image_res < 640 * 480
            ? t("resolution_slider.too_low")
            : t("resolution_slider.good"),
      },
      {
        key: "shadows",
        name: t("shadows_slider.title"),
        value: sliders?.shadow_score?.toFixed() || 0,
        videoUrl: "#",
        message:
          parameters?.shadow_percentage !== undefined &&
          (parameters.shadow_percentage < 5
            ? t("shadows_slider.missing")
            : parameters.shadow_percentage > 30
            ? t("shadows_slider.too_much")
            : t("shadows_slider.just_right")),
      },
    ],
  };

  return (
    <>
      <Button
        className="absolute bottom-2 right-2"
        isDisabled={isDisabled || !currentImageScore?.sliders}
        isIconOnly
        onPress={onOpen}
        color={
          currentImageScore?.is_loading || !currentImageScore?.sliders
            ? "default"
            : "primary"
        }
        isLoading={currentImageScore?.is_loading}
      >
        <SpeedOutlined />
      </Button>
      <Drawer
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="sm"
      >
        <DrawerContent>
          <DrawerHeader className="flex flex-col gap-1 px-4 xs:px-6">
            <h3 className="text-lg font-bold">{t("drawer_title")}</h3>
            <p className="text-sm text-default-500">
              {t("drawer_description")}
            </p>
          </DrawerHeader>
          <DrawerBody className="relative w-full gap-4 px-4 xs:px-6">
            <CircularProgress
              label={t("final_score_slider")}
              classNames={{
                svg: "w-36 h-36 drop-shadow-md",
                value: "text-xl font-semibold dark:text-white",
              }}
              className="mx-auto"
              color={valueColorMap(chart.current as number).color}
              showValueLabel
              strokeWidth={3}
              value={chart.current as number}
              valueLabel={`${chart.current}/${chart.total}`}
              maxValue={chart.total}
            />
            <ScrollShadow className="w-full max-h-full scrollbar">
              <Accordion
                defaultExpandedKeys={["lightning"]}
                showDivider={false}
                variant="light"
                disableIndicatorAnimation
                disallowEmptySelection
              >
                {chart.categories.map((category) => (
                  <AccordionItem
                    key={category.key}
                    aria-label={category.name}
                    indicator={<InfoOutlined />}
                    classNames={{
                      content: "pb-4",
                    }}
                    title={
                      <div className="flex flex-col items-start gap-y-1 w-full">
                        <div className="w-full flex items-center justify-between">
                          <dt className="text-small font-medium capitalize dark:text-white">
                            {category.name}{" "}
                          </dt>
                          <dd className="text-small font-semibold dark:text-white">
                            {category.value}/{chart.total}
                          </dd>
                        </div>
                        <Progress
                          aria-label="status"
                          className="w-full"
                          color={valueColorMap(category.value as number).color}
                          value={category.value as number}
                          maxValue={10}
                        />
                      </div>
                    }
                  >
                    <p className="text-sm">{category.message}</p>
                    <Link
                      className="mt-2 flex items-center gap-1 text-sm"
                      href={`${baseURL}/academy/${category.videoUrl}`}
                      target="_blank"
                      underline="always"
                    >
                      {t("watch_video")}
                    </Link>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollShadow>
            <div className="flex flex-col gap-2 mt-auto w-full bg-white">
              <p className="text-sm">{t("academy_tip")}</p>

              <Link
                href={`${baseURL}/academy`}
                target="_blank"
                className="mt-auto"
              >
                <Button className="w-full btn btn-primary-gradient" size="lg">
                  {t("academy_learn_more_button")} <SchoolOutlined />
                </Button>
              </Link>
            </div>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
