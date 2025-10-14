
/** util: clave string para sets/map */
const key = (p: Point) => `${p.x},${p.y}`;

/** ordena los píxeles de borde siguiendo el contorno con regla de la mano derecha (moore) */
function orderBorder(points: Point[]): Point[] {
  if (points.length === 0) return [];

  // set para membership O(1)
  const S = new Set(points.map(key));

  // punto inicio: el más arriba (y mínimo) y, en empate, x mínimo
  let start = points.reduce((best, p) =>
    p.y < best.y || (p.y === best.y && p.x < best.x) ? p : best
  );

  // 8 vecinos en orden horario: ↑, ↑→, →, ↓→, ↓, ↓←, ←, ↑←
  const dirs: Point[] = [
    { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
    { x: 0, y: 1 },  { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 },
  ];

  // empezamos “viniendo” desde la izquierda (dirección →) para que busque alrededor correctamente
  let curr = start;
  let dirIdx = 2; // índice de → en dirs
  const ordered: Point[] = [start];

  // para evitar bucles infinitos si hay huecos: límite razonable
  const maxSteps = S.size * 10;

  for (let step = 0; step < maxSteps; step++) {
    // moore: empezamos a buscar desde dirIdx+6 (giro a la derecha) y probamos 8 vecinos
    let found = false;
    for (let i = 0; i < 8; i++) {
      const idx = (dirIdx + 6 + i) % 8;
      const d = dirs[idx];
      const nxt = { x: curr.x + d.x, y: curr.y + d.y };
      if (S.has(key(nxt))) {
        // avanzamos
        ordered.push(nxt);
        curr = nxt;
        dirIdx = idx; // la nueva “dirección previa”
        found = true;
        break;
      }
    }
    // si no hay vecino, el borde está roto; terminamos
    if (!found) break;
    // si volvimos al inicio y ya dimos al menos un paso, cerramos
    if (curr.x === start.x && curr.y === start.y && ordered.length > 1) break;
    // si por ruido repetimos el último punto, evita duplicados
    if (ordered.length >= 2) {
      const a = ordered[ordered.length - 1];
      const b = ordered[ordered.length - 2];
      if (a.x === b.x && a.y === b.y) ordered.pop();
    }
  }

  // opcional: elimina la repetición del primer punto al final para trabajar con polilínea abierta
  if (
    ordered.length > 1 &&
    ordered[0].x === ordered[ordered.length - 1].x &&
    ordered[0].y === ordered[ordered.length - 1].y
  ) {
    ordered.pop();
  }

  return ordered;
}

function splitDiagonals(pts: Point[]): Point[] {
  if (pts.length < 2) return pts.slice();
  const out: Point[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = out[out.length - 1];
    const b = pts[i];
    if (a.x !== b.x && a.y !== b.y) {
      // inserta esquina en L; elige una regla fija para ser determinista
      out.push({ x: b.x, y: a.y }); // primero horizontal, luego vertical
    }
    out.push(b);
  }
  return out;
}

/** simplifica manteniendo solo extremos de tramos horizontales (y constante) o verticales (x constante) */
function simplifyAxisAligned(ordered: Point[]): Point[] {
  if (ordered.length <= 2) return ordered.slice();

  const out: Point[] = [];
  for (let i = 0; i < ordered.length; i++) {
    const p = ordered[i];
    out.push(p);

    // mientras haya 3 últimos puntos y formen una línea recta vertical u horizontal, colapsa el del medio
    while (out.length >= 3) {
      const a = out[out.length - 3];
      const b = out[out.length - 2];
      const c = out[out.length - 1];
      const vertical = a.x === b.x && b.x === c.x;
      const horizontal = a.y === b.y && b.y === c.y;
      if (vertical || horizontal) {
        // elimina el punto del medio (b) para dejar solo extremos a–c
        out.splice(out.length - 2, 1);
      } else {
        break;
      }
    }
  }
  return out;
}


export const useAutomesh = () => {
    const mesh = useMesh();
    
    const automesh = (borderPoints: Point[]) => {
        const ordered = orderBorder(borderPoints);
        const withoutDiags = splitDiagonals(ordered);
        const simplified = simplifyAxisAligned(withoutDiags);
        for (const p of simplified) {
            mesh.addPoint(p.x, p.y);
        }
    }

    return {
        automesh,
    }
}