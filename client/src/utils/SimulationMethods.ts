import { Player } from "../../../server/types/Player"

export function predictPositivePoints(player: Player): number {
  const { MP, ThreeP, TwoP, DRB, AST, TOV } = player
  const val = 1.182965 + 0.164520 * MP + 1.058200 * ThreeP + 0.393399 * TwoP + 1.085329 * DRB + 1.486653 * AST - 0.411815 * TOV + 0.058070 * DRB * AST - 0.131127 * ThreeP * TOV - 0.043513 * MP * AST - 0.033444 * MP * DRB
  return val
}

export function predictNegativePoints(player: Player): number {
  const { GS, MP, ThreePA, TwoP, TwoPA, DRB, AST, BLK, TOV, ThreeP } = player
  const val = -2.957266 - 4.356233 * GS - 0.271290 * MP - 0.179994 * ThreePA + 0.399125 * TwoP - 0.906246 * TwoPA + 0.412483 * DRB + 0.161072 * AST + 0.035350 * BLK - 0.382476 * TOV + 0.239528 * GS * MP - 0.575765 * GS * TwoPA - 0.300584 * DRB * GS + 0.033754 * MP * TwoPA - 0.050902 * AST * ThreeP + 0.098252 * ThreePA * BLK
  return val
}
