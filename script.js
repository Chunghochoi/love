document.addEventListener('DOMContentLoaded', () => {
    // --- CÀI ĐẶT ---
    const totalCandies = 20; // Tổng số kẹo ban đầu
    const messages = [
        "Hôm nay, dù em có bận rộn đến đâu, cũng hãy nhớ rằng có một người luôn dõi theo và mong em được bình yên nhé. Chỉ cần em vui vẻ, thế giới của anh cũng trở nên thật nhẹ nhàng.",
        "Mỗi sớm mai thức dậy, điều anh mong chờ không phải là ánh nắng ban mai mà chính là nụ cười của em. Nụ cười ấy có sức mạnh xua tan mọi mệt mỏi và thắp sáng cả một ngày dài.",
        "Bé ơi, một ngày nữa lại sắp qua rồi. Dù hôm nay chúng ta không ở gần nhau, hãy biết rằng em luôn là suy nghĩ cuối cùng của anh trước khi chìm vào giấc ngủ. Mơ về chúng ta nhé!",
        "Kể từ ngày gặp em, anh mới hiểu thế nào là 'nhà'. Nhà không phải là một nơi chốn, mà là cảm giác bình yên mỗi khi được ở bên em. Em chính là mảnh ghép hoàn hảo của anh.",
        "Em yêu, có những ngày thật khó khăn, nhưng chỉ cần nghĩ đến việc có em bên cạnh, anh lại thấy mình là người đàn ông may mắn nhất thế gian. Cảm ơn em đã luôn là hậu phương vững chắc.",
        "Mỗi khi nhìn vào mắt em, anh lại thấy được cả tương lai mà chúng ta sẽ cùng nhau xây đắp. Em không chỉ là tình yêu, mà còn là nguồn động lực to lớn của anh.",
        "Nếu có một điều ước, anh sẽ ước thời gian ngừng trôi mỗi khi chúng ta ở bên nhau. Khoảnh khắc bên em là khoảnh khắc vô giá.",
        "Thế giới ngoài kia có thể phức tạp và ồn ào, nhưng thế giới của anh chỉ cần có em là đủ bình yên. Yêu em rất nhiều!",
        "Cảm ơn em đã đến, mang theo cả ánh nắng và sự ấm áp, xua tan đi những ngày u ám trong cuộc đời anh. Em là cầu vồng của anh.",
        "Anh không cần bản đồ, vì mọi con đường trong trái tim anh đều dẫn đến một nơi duy nhất: đó là em."
    ];
    // --- KẾT THÚC CÀI ĐẶT ---

    const gumballContainer = document.querySelector('.gumball-container');
    const lever = document.getElementById('lever');
    const plusBtn = document.getElementById('plus-btn');
    const minusBtn = document.getElementById('minus-btn');
    const pullCountSpan = document.getElementById('pull-count');
    const outputArea = document.getElementById('output-area');
    const remainingCountSpan = document.getElementById('remaining-count');
    
    const modal = document.getElementById('message-modal');
    const messageText = document.getElementById('message-text');
    const closeModalBtn = document.getElementById('close-modal');

    let pullCount = 1;
    let availableCandies = totalCandies;
    let isSpinning = false;
    let messageQueue = [];

    const gumballColors = ['#ff7675', '#74b9ff', '#55efc4', '#ffeaa7', '#a29bfe', '#fd79a8', '#81ecec'];

    function getRandomColor() {
        return gumballColors[Math.floor(Math.random() * gumballColors.length)];
    }

    function createGumballs(count) {
        gumballContainer.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const gumball = document.createElement('div');
            gumball.classList.add('gumball');
            gumball.style.backgroundColor = getRandomColor();
            gumball.style.left = `${Math.random() * 85}%`;
            gumball.style.top = `${Math.random() * 85}%`;
            gumballContainer.appendChild(gumball);
        }
    }

    function updatePullCount(amount) {
        pullCount = Math.max(1, Math.min(pullCount + amount, availableCandies));
        pullCountSpan.textContent = pullCount;
    }

    function showModal(message) {
        messageText.textContent = message;
        modal.style.display = 'flex';
    }

    function hideModal() {
        modal.style.display = 'none';
        processMessageQueue(); // Check for next message
    }

    function processMessageQueue() {
        if (messageQueue.length > 0) {
            const nextMessage = messageQueue.shift();
            setTimeout(() => showModal(nextMessage), 300);
        } else {
            isSpinning = false; // Re-enable controls when all messages are shown
        }
    }

    function handleGachaPull() {
        if (isSpinning) return;

        if (availableCandies <= 0) {
            showModal("Hết kẹo mất rồi, nhưng tình yêu của anh dành cho em thì không bao giờ cạn!");
            return;
        }

        if (pullCount > availableCandies) {
            showModal(`Không đủ kẹo! Chỉ còn ${availableCandies} viên thôi.`);
            return;
        }

        isSpinning = true;
        outputArea.innerHTML = ''; // Clear previous gumballs

        const machine = document.querySelector('.gacha-machine');
        machine.style.animation = 'shake 0.5s';
        setTimeout(() => machine.style.animation = 'float 3s ease-in-out infinite', 500);

        const numToPull = pullCount;
        availableCandies -= numToPull;

        for (let i = 0; i < numToPull; i++) {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            messageQueue.push(randomMessage);

            setTimeout(() => {
                const dispensedGumball = document.createElement('div');
                dispensedGumball.classList.add('output-gumball');
                dispensedGumball.style.backgroundColor = getRandomColor();
                outputArea.appendChild(dispensedGumball);

                // Remove a gumball from inside the machine
                if(gumballContainer.firstChild) {
                    gumballContainer.removeChild(gumballContainer.firstChild);
                }
            }, i * 300); // Stagger the drop animation
        }

        setTimeout(processMessageQueue, numToPull * 300);
        
        remainingCountSpan.textContent = availableCandies;
        updatePullCount(0); // Recalculate max pull count
    }

    // Event Listeners
    plusBtn.addEventListener('click', () => updatePullCount(1));
    minusBtn.addEventListener('click', () => updatePullCount(-1));
    lever.addEventListener('click', handleGachaPull);
    closeModalBtn.addEventListener('click', hideModal);
    window.addEventListener('click', (event) => {
        if (event.target == modal) {
            hideModal();
        }
    });

    // Initial setup
    createGumballs(totalCandies);
    remainingCountSpan.textContent = availableCandies;
});
