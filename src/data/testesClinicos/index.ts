/** Testes clínicos do quadrante inferior, um arquivo por região, cada um com
 *  as fontes que cita. A ordem aqui é a ordem de exibição dentro da região. */
import { lombarSources, lombarTests } from "./lombar";
import { pelveSources, pelveTests } from "./pelve";
import { quadrilSources, quadrilTests } from "./quadril";
import {
  joelhoLigamentosSources,
  joelhoLigamentosTests,
} from "./joelhoLigamentos";
import {
  joelhoMeniscoPatelaSources,
  joelhoMeniscoPatelaTests,
} from "./joelhoMeniscoPatela";
import { tornozeloPeSources, tornozeloPeTests } from "./tornozeloPe";

export const lowerQuadrantTests = [
  ...lombarTests,
  ...pelveTests,
  ...quadrilTests,
  ...joelhoLigamentosTests,
  ...joelhoMeniscoPatelaTests,
  ...tornozeloPeTests,
];

export const lowerQuadrantSources = [
  ...lombarSources,
  ...pelveSources,
  ...quadrilSources,
  ...joelhoLigamentosSources,
  ...joelhoMeniscoPatelaSources,
  ...tornozeloPeSources,
];
