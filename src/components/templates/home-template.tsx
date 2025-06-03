/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
// import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import Image from "next/image";
// import L from "leaflet";
// import "leaflet/dist/leaflet.css";
import "leaflet/dist/leaflet.css";
import api from "@/config/server";

const MapContainer = dynamic(
  () => import("react-leaflet").then((mod) => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((mod) => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import("react-leaflet").then((mod) => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), {
  ssr: false,
});

export default function HomeTemplate() {
  const [devicePosition, setDevicePosition] = useState<[number, number] | null>(
    null
  );
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", token: "" });
  const [showDeviceListModal, setShowDeviceListModal] = useState(false);
  const [devices, setDevices] = useState<any[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    window.location.href = "/pages/sign-in"; // redireciona para login
  };

  const fetchDevices = async () => {
    const tokenFromStorage = localStorage.getItem("token");
    const user_id = localStorage.getItem("userId");
    try {
      const response = await api.get("/device/" + user_id, {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      });

      if (response.status === 200) {
        setDevices(response.data);
        setShowDeviceListModal(true);
      } else {
        alert("Erro ao buscar dispositivos");
      }
    } catch (error: any) {
      alert("Erro ao buscar dispositivos: " + error.message);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dispositivo cadastrado:", formData);
    const { name, token } = formData;
    const tokenFromStorage = localStorage.getItem("token");
    const response = await api.post(
      "/device",
      {
        name,
        token,
      },
      {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      }
    );

    if (response.status === 200) {
      alert("Dispositivo cadastrado com sucesso!");
      setFormData({ name: "", token: "" });
    } else {
      alert("Erro ao cadastrar dispositivo: " + response.data.message);
    }

    setShowModal(false);
  };

  useEffect(() => {
    let L: typeof import("leaflet") | undefined;
    if (typeof window !== "undefined") {
      (async () => {
        L = (await import("leaflet")).default;
        // await import("leaflet/dist/leaflet.css");
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/leaflet/marker.svg",
          iconUrl: "/leaflet/marker.svg",
        });
      })();

      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setDevicePosition([latitude, longitude]);
          },
          (error) => {
            console.error("Erro ao obter localização:", error);
          },
          { enableHighAccuracy: true }
        );
      }
    }
  }, []);

  return (
    <div className="h-screen w-full flex flex-col relative">
      <div className="p-4 bg-white shadow-md z-10 gap-4 flex items-center">
        <Image
          src={"/img/logo.png"}
          alt="Sentinela logo"
          width={150}
          height={250}
          priority={true}
          style={{ objectFit: "contain", borderRadius: "50%" }}
        />
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Cadastrar Dispositivo
        </button>
        <button
          onClick={fetchDevices}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Encontrar Dispositivo
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
        >
          Sair
        </button>
      </div>

      <div className="flex-1 z-0">
        {devicePosition && (
          <MapContainer
            center={devicePosition}
            zoom={16}
            scrollWheelZoom
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={devicePosition}>
              <Popup>Você está aqui</Popup>
            </Marker>
          </MapContainer>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Cadastrar Dispositivo
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome do Dispositivo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Token
                </label>
                <input
                  type="text"
                  name="token"
                  value={formData.token}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-500"
                  required
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeviceListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Dispositivos Cadastrados
            </h2>
            {devices.length === 0 ? (
              <p className="text-gray-600">Nenhum dispositivo encontrado.</p>
            ) : (
              <ul className="space-y-2">
                {devices.map((device, index) => (
                  <li
                    key={index}
                    className="border border-gray-200 p-3 rounded-md shadow-sm bg-gray-50"
                  >
                    <p className="text-sm font-medium text-gray-800">
                      Nome: {device.name}
                    </p>
                    <p className="text-xs text-gray-600">
                      Token: {device.token}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex justify-end mt-4">
              <button
                onClick={() => setShowDeviceListModal(false)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
