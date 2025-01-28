class NetworkTester {
    static instance;
    lastLatencies = [];
    testsAllowed = true;
    downloadUrl = 'https://yourserver.com/largefile';
    uploadUrl = 'https://yourserver.com/upload';

    constructor() {
        if (NetworkTester.instance) {
            return NetworkTester.instance;
        }
        this.webhookUrl = 'https://your-client.com/webhook'; // Указать свой URL
        this.registerWebhook();
        NetworkTester.instance = this;
    }

    static getInstance() {
        if (!NetworkTester.instance) {
            new NetworkTester();
        }
        return NetworkTester.instance;
    }

    setTestsAllowed(status) {
        this.testsAllowed = status;
    }

    isElementActive() {
        const statusElement = document.getElementById('testStatus');
        return statusElement && statusElement.parentNode.classList.contains('enabled');
    }

    async measureLatency(asyncFunction, ...args) {
        if (!this.isElementActive()) {
            console.log("Visual element is not active. Latency tests are skipped.");
            return;
        }

        const start = performance.now();
        try {
            const result = await asyncFunction(...args);
            const end = performance.now();
            const latency = end - start;
            console.log(`Latency for ${asyncFunction.name}: ${latency.toFixed(2)} ms`);
            this.updateLatency(latency);
            return result;
        } catch (error) {
            console.error(`Error in ${asyncFunction.name}:`, error);
            throw error;
        }
    }

    updateLatency(latency) {
        this.lastLatencies.push(latency);
        if (this.lastLatencies.length > 3) {
            this.lastLatencies.shift();
        }
        this.evaluateConnectionQuality();
    }

    evaluateConnectionQuality() {
        if (this.lastLatencies.length < 3) {
            statusElement.innerHTML = "Connection: Testing...";
            console.log("Collecting more latency data...");
            return;
        }

        const averageLatency = this.lastLatencies.reduce((a, b) => a + b, 0) / this.lastLatencies.length;
        let quality;
        if (averageLatency < 100) {
            quality = 'Excellent';
        } else if (averageLatency < 200) {
            quality = 'Good';
        } else {
            quality = 'Poor';
        }

        this.updateVisualElement(quality);
    }

    updateVisualElement(quality) {
        const statusElement = document.getElementById('testStatus');
        if (statusElement) {
            statusElement.innerHTML = `Connection: ${quality}`;
        }
    }

    async testBandwidth() {
        if (!this.testsAllowed || !this.isElementActive()) {
            console.log("Bandwidth tests are not currently allowed or the element is not active.");
            return;
        }

        try {
            const downloadStart = performance.now();
            const downloadResponse = await fetch(this.downloadUrl);
            const data = await downloadResponse.blob();
            const downloadEnd = performance.now();
            const downloadTime = downloadEnd - downloadStart;
            const downloadSpeed = data.size / (downloadTime / 1000) / 1024 / 1024 * 8;

            console.log(`Download speed: ${downloadSpeed.toFixed(2)} Mbps`);

            const uploadStart = performance.now();
            await fetch(this.uploadUrl, { method: 'POST', body: data });
            const uploadEnd = performance.now();
            const uploadTime = uploadEnd - uploadStart;
            const uploadSpeed = data.size / (uploadTime / 1000) / 1024 / 1024 * 8;

            console.log(`Upload speed: ${uploadSpeed.toFixed(2)} Mbps`);

            this.logResult('Bandwidth', `Download: ${downloadSpeed.toFixed(2)} Mbps, Upload: ${uploadSpeed.toFixed(2)} Mbps`, 'Bandwidth test completed successfully.');
        } catch (error) {
            console.error('Error testing bandwidth:', error);
            this.logResult('Bandwidth', null, `Error testing bandwidth: ${error.message}`);
        }
    }

    logResult(testType, result, message) {
        console.log(`${testType} Result: ${result !== null ? result + ' ms' : 'N/A'}, Message: ${message}`);
    }



    async registerWebhook() {
        try {
            const response = await fetch('https://yourserver.com/register-webhook', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ webhookUrl: this.webhookUrl }),
            });

            if (response.ok) {
                console.log("Webhook registered successfully.");
            } else {
                console.error("Failed to register webhook:", response.status);
            }
        } catch (error) {
            console.error("Error registering webhook:", error);
        }
    }

    async handleWebhook(payload) {
        const data = JSON.parse(payload);
        if (data.command === 'testBandwidth') {
            await this.testBandwidth();
        } else {
            console.log("Unknown command received via webhook:", data.command);
        }
    }
}
