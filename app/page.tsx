"use client";
import { useCallback, useState } from "react";

export default function Home() {
  const [farmAmount, setFarmAmount] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleFarming = useCallback(async () => {
    try {
      setLoading(true);
      await Promise.all(
        Array(Number(farmAmount))
          .fill(0)
          .map(() => {
            return fetch(`/api/farm-devsol?foo=${Math.random()}`);
          })
      );
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      console.error(error);
    }
  }, [farmAmount]);
  return (
    <div>
      <input
        value={farmAmount}
        onChange={(e) => setFarmAmount(e.target.value)}
        placeholder="amount to farm #"
      />

      <button onClick={handleFarming} disabled={loading}>
        FARM
      </button>
      {loading && <div>LOADING...</div>}
    </div>
  );
}
