class MockUnreliablePaymentsAPI {
  constructor() {
    this.payments = new Map();
    this.authTokens = new Set();
    this.idCounter = 1;
  }

  generateAuthToken() {
    const parts = [
      Math.floor(1000 + Math.random() * 9000).toString(),
      Math.floor(10000 + Math.random() * 90000).toString(),
      Math.floor(100000 + Math.random() * 900000).toString(),
      Math.floor(10000 + Math.random() * 90000).toString(),
    ];
    return parts.join("-");
  }

  createAuthToken() {
    const token = this.generateAuthToken();
    this.authTokens.add(token);
    return { token };
  }

  createPayment(payload, authToken) {
    if (!this.authTokens.has(authToken)) {
      return { error: "Invalid auth token" };
    }

    const { referenceId, amount, cardNumber, cardExpMonth, cardExpYear, note } =
      payload;

    if (
      !referenceId ||
      !amount ||
      !cardNumber ||
      !cardExpMonth ||
      !cardExpYear
    ) {
      return { error: "Missing required fields" };
    }

    if (this.payments.has(referenceId)) {
      return { error: "Duplicate referenceId" };
    }

    if (cardNumber === "2222222222222222") {
      return { error: "Card number is invalid" };
    }

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (
      cardExpYear < currentYear ||
      (cardExpYear === currentYear && cardExpMonth < currentMonth)
    ) {
      return {
        error: "Card is expired",
      };
    }

    const payment = {
      id: this.idCounter++,
      referenceId,
      amount,
      status: "Created",
      note,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.payments.set(referenceId, payment);

    // Simulate status changes
    this.simulateStatusChanges(payment, cardNumber);

    return { result: payment };
  }

  getPayment(referenceId, authToken) {
    if (!this.authTokens.has(authToken)) {
      return { error: "Invalid auth token" };
    }

    const payment = this.payments.get(referenceId);
    if (!payment) {
      return { error: "Payment not found" };
    }

    return { result: payment };
  }

  simulateStatusChanges(payment, cardNumber) {
    setTimeout(() => {
      payment.status = "Pending";
      payment.updatedAt = new Date().toISOString();
      setTimeout(() => {
        if (cardNumber === "4444444444444444") {
          payment.status = "Failed";
        } else if (cardNumber === "3333333333333333") {
          payment.status = "Failed";
        } else {
          payment.status = "Successful";
        }
        payment.updatedAt = new Date().toISOString();
      }, 5000);
      console.log("Status: ", payment.status);
    }, 5000);
    console.log("Status: ", payment.status);
  }
}

module.exports = new MockUnreliablePaymentsAPI();
