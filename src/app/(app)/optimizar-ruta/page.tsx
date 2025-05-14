
import OptimizarRutaPageComponent from "@/components/optimizar-ruta/OptimizarRutaPageComponent";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Optimizar Ruta | Rumbo Envíos',
  description: 'Optimiza tus rutas de reparto diarias.',
};

export default function OptimizarRutaPage() {
  return <OptimizarRutaPageComponent />;
}

