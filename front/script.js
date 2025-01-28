function toggleTest(element) {
    console.log("toggleTest called"); // Проверяем, вызывается ли функция

    const statusText = document.getElementById('testStatus');
    if (!statusText) {
        console.error("Element with id 'testStatus' not found.");
        return;
    }

    if (element.classList.contains('disabled')) {
        element.classList.remove('disabled');
        element.classList.add('enabled');
        statusText.innerHTML = 'Connection: Initializing...';

        // Пример инициализации NetworkTester
        const tester = NetworkTester.getInstance();
        tester.setTestsAllowed(true);
        console.log("Element enabled. NetworkTester initialized.");
    } else {
        element.classList.remove('enabled');
        element.classList.add('disabled');
        statusText.innerHTML = 'Click to enable<br>connection testing';

        // Отключаем тестирование
        const tester = NetworkTester.getInstance();
        tester.setTestsAllowed(false);
        console.log("Element disabled. NetworkTester stopped.");
    }
}
