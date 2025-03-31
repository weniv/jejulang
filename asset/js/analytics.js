//------------------------------------------------------------
// @post /collect/pageview
function collectPageView() {
    const this_page_url = window.location.href;
    let session_id = sessionStorage.getItem("session_id");

    if (!session_id) {
        fetch("https://dev.wenivops.co.kr/api/weniv_analytics/collect/pageview", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ url: this_page_url }),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }
                return response.json();
            })
            .then((data) => {
                sessionStorage.setItem("session_id", data.session_id);
                // 여기서 주석을 풀어 data가 제대로 들어오는지 확인해보고 잘 들어온다면 주석을 제거하고 push 합니다.
                // console.log("data: ", data);
            })
            .catch((error) => console.error("Error:", error));
    }
}

window.addEventListener("load", (e) => {
    const lastPage = localStorage.getItem("lastPage");

    if (lastPage !== window.location.pathname) {
        collectPageView();
    }

    localStorage.setItem("lastPage", window.location.pathname);
});

//------------------------------------------------------------
// @post /collect/anchor-click
async function collectAnchorClick(event, text) {
    event.preventDefault();

    const ANCHOR = event.currentTarget;

    const session_id = sessionStorage.getItem("session_id");

    const source_url = window.location.href;
    const target_url = ANCHOR.href;
    const target_tar = ANCHOR.target || "_self";

    try {
        const response = await fetch(`https://dev.wenivops.co.kr/api/weniv_analytics/collect/anchor-click`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Session-Id": session_id,
            },
            body: JSON.stringify({ source_url, target_url, type: text }),
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        } else {
            // 여기서 주석을 풀어 data가 제대로 들어오는지 확인해보고 잘 들어온다면 else 구문을 제거하고 push 합니다.
            // const data = await response.json();
            // console.log(data);
        }
    } catch (error) {
        console.error("Error:", error);
    } finally {
        window.open(target_url, target_tar);
    }
}

// 외부 링크
document.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", (event) => collectAnchorClick(event, `교육서비스:${anchor.innerText}`));
});
