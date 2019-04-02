declare const window: Window & { tronWeb: any; _contracts: { todoList: any } };

export class ContractClient {
  private tronWeb: any;
  private todoListContract: any;
  private isReady = false;

  constructor() {
    this.loadTronweb()
      .then(() => this.loadContract())
      .then(() => {
        this.isReady = true;
      })
      .catch(err => {
        throw err;
      });
  }

  async greeting() {
    await this.waitUntilReady();
    return this.todoListContract.getGreeting().call();
  }

  async multiply(n: number) {
    await this.waitUntilReady();
    return this.todoListContract.multiply(n).call();
  }

  private async loadTronweb() {
    for (let i = 0; i < 30; i++) {
      if (window.tronWeb) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    if (window.tronWeb) {
      while (!window.tronWeb.ready) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      this.tronWeb = window.tronWeb;
      console.log('tronWeb:', this.tronWeb);
    } else {
      throw new Error('TronLink is not installed.');
    }
  }

  private async loadContract() {
    const address = getDeployedAddress(
      await fetch('/contracts/TodoList.json').then(res => res.json()),
      this.tronWeb.fullNode.host,
    );
    this.todoListContract = await this.tronWeb.contract().at(address);
    window._contracts = { todoList: this.todoListContract }; // for debug on browser
    console.log('contract:', this.todoListContract);
  }

  async waitUntilReady() {
    while (!this.isReady) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
}

function getDeployedAddress(
  contractJson: { networks: Record<string, { address: string }> },
  tronWebHost: string,
): string {
  // Mainnet: '1', Shasta Testnet: '2', Privatenet: '9'
  const networkVersion = /127\.0\.0\.1/.test(tronWebHost) ? '9' : /api\.shasta\.trongrid/.test(tronWebHost) ? '2' : '1';
  const address =
    Object.entries(contractJson.networks)
      .filter(([version, obj]) => version === networkVersion)
      .map(([version, obj]) => obj.address)[0] || '';
  return address;
}
