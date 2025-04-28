export const canCumulateLabel = (
  appliedLabels: string[],
  label: string
): boolean => {
  const cumulativeLabels = ["ASC", "MSC"];
  if (cumulativeLabels.includes(label)) {
    for (let i = 0; i < cumulativeLabels.length; i++) {
      const cumulativeLabel = cumulativeLabels[i];
      if (appliedLabels.includes(cumulativeLabel)) {
        return false;
      }
    }
    return true;
  }
  return true;
};
