import { Player } from "../../../server/types/Player"

export function predictPositivePoints(player: Player): number {
  const { MP, ThreeP, TwoP, DRB, AST, TOV } = player
  const val = 1.182965 + 0.164520 * MP + 1.058200 * ThreeP + 0.393399 * TwoP + 1.085329 * DRB + 1.486653 * AST - 0.411815 * TOV + 0.058070 * DRB * AST - 0.131127 * ThreeP * TOV - 0.043513 * MP * AST - 0.033444 * MP * DRB
  return Math.floor(val)
}

export function predictNegativePoints(player: Player): number {
  const { GS, MP, ThreePA, TwoP, TwoPA, DRB, AST, BLK, TOV, ThreeP } = player
  const val = -2.957266 - 4.356233 * GS - 0.271290 * MP - 0.179994 * ThreePA + 0.399125 * TwoP - 0.906246 * TwoPA + 0.412483 * DRB + 0.161072 * AST + 0.035350 * BLK - 0.382476 * TOV + 0.239528 * GS * MP - 0.575765 * GS * TwoPA - 0.300584 * DRB * GS + 0.033754 * MP * TwoPA - 0.050902 * AST * ThreeP + 0.098252 * ThreePA * BLK
  return Math.floor(val)
}
/**
 * 
 * @param p 
 * @param m 
 * @param checks Should we check for whether these values are 'real' or not
 * @returns 
 */
export function randomGameStats(p: Player, m: Player, checks: boolean) {

  function sim(mean: number, std: number) {
    return Math.floor(rand_bm(mean - std * 2, mean + std * 2, 1))
  }
  //free throws
  var FT = sim(p.FT, m.FT)
  var FTA = sim(p.FTA, m.FTA)
  if (checks && FT > FTA) {
    //check free throws
    FT = FTA
  }
  var TwoP = sim(p.TwoP, m.TwoP)
  var TwoPA = sim(p.TwoPA, m.TwoPA)

  if (checks && TwoP > TwoPA) {
    //check 2-pointers
    TwoP = TwoPA
  }
  var ThreeP = sim(p.ThreeP, m.ThreeP)
  var ThreePA = sim(p.ThreePA, m.ThreePA)
  if (checks && ThreeP > ThreePA) {
    //check threes
    ThreeP = ThreePA
  }
  var PTS = sim(p.PTS, m.PTS)
  var PTS_diff = PTS - (TwoP * 2 + ThreeP * 3 + FT)
  if (checks && PTS_diff != 0) {
    //TODO create some method to resolve this difference
  }

  var GS = sim(p.GS, m.GS)
  if (checks && GS != 0 && GS != 1) {
    if (GS > 1) GS = 1
    if (GS < 0) GS = 0
  }

  var ORB = sim(p.ORB, m.ORB)
  var DRB = sim(p.DRB, m.DRB)
  var outcomeObj = {
    PlayerName: p.PlayerName,
    GS: GS,
    MP: sim(p.MP, m.MP),
    ThreeP: ThreeP,
    ThreePA: ThreePA,
    TwoP: TwoP,
    TwoPA: TwoPA,
    FT: FT,
    FTA: FTA,
    ORB: ORB,
    DRB: DRB,
    TRB: ORB + DRB,
    AST: sim(p.AST, m.AST),
    STL: sim(p.STL, m.STL),
    BLK: sim(p.BLK, m.BLK),
    TOV: sim(p.TOV, m.TOV),
    PF: sim(p.PF, m.PF),
    PTS: sim(p.PTS, m.PTS),
    PTS_diff: PTS_diff
  }


  console.log(outcomeObj)
  return outcomeObj
}

//box-mueller transformation
function rand_bm(min: number, max: number, skew: number) {
  let u = 0, v = 0;
  while (u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while (v === 0) v = Math.random()
  let num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v)

  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0)
    num = rand_bm(min, max, skew) // resample between 0 and 1 if out of range

  else {
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}