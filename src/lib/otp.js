export default {
  generate(secret) {
    return Math.round(Math.random() * 999999)
  },

  timeRemaining() {
    return 30
  },
}
