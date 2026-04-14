export const getGradientColors = (temp: number): string[] => {
  if (temp <= 0) {
    return ['#3698ef', '#00f2fe'];
  } else if (temp > 0 && temp <= 15) {
    return ['#89b2f5', '#5bb5de'];
  } else if (temp > 15 && temp <= 25) {
    return ['#ecc237', '#fa8c6d'];
  } else {
    return ['#ff0844', '#e96d47'];
  }
};
