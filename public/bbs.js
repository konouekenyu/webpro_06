"use strict";

let number = 0;  // 投稿件数をいくつ読んだか
const bbs = document.querySelector('#bbs');


document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;  // 投稿者の名前
    const message = document.querySelector('#message').value;  // 投稿内容

    const params = {  // URL Encode
        method: "POST",
        body:  'name=' + name + '&message=' + message,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/post";
    fetch(url, params)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then((response) => {
        document.querySelector('#message').value = ""; // 投稿内容が来ているか確認するためにあえて消している

    });
});

document.querySelector('#checkButton').addEventListener('click', () => {
    loadPosts();  // 投稿チェックボタンが押されたときにのみ投稿を更新
});


function loadPosts() {
    const params = {
        method: "POST",
        body: '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/read";
    fetch(url, params)
    .then((response) => {
        if (!response.ok) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then((response) => {
        bbs.innerHTML = '';  // 既存の投稿を消去
        number += response.messages.length;
        response.messages.forEach((post, index) => {
            let cover = document.createElement('div');
            cover.className = 'cover';
            let name_area = document.createElement('span');
            name_area.className = 'name';
            name_area.innerText = post.name;
            let mes_area = document.createElement('span');
            mes_area.className = 'mes';
            mes_area.innerText = post.message;
            cover.appendChild(name_area);
            cover.appendChild(mes_area);

            const likeButton = document.createElement('button');// いいねボタン
            likeButton.innerText = `いいね (${post.likes || 0})`;
            likeButton.addEventListener('click', () => {
                fetch('/like', {
                    method: 'POST',
                    body: `id=${index}`,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .then((response) => response.json())
                .then((data) => {
                    likeButton.innerText = `いいね (${data.likes})`;
                });
            });

            cover.appendChild(likeButton);

            const deleteButton = document.createElement('button');// 削除ボタン
            deleteButton.innerText = '削除';
            deleteButton.addEventListener('click', () => {
                fetch('/delete', {
                    method: 'POST',
                    body: `id=${index}`,
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
                .then((response) => response.json())
                .then((data) => {
                    loadPosts();  // 投稿削除後、再度投稿をロード
                });
            });

            cover.appendChild(deleteButton);

            const editButton = document.createElement('button');// 編集ボタン
            editButton.innerText = '編集';
            editButton.addEventListener('click', () => {
                const newMessage = prompt('新しいメッセージを入力してください', post.message);
                if (newMessage) {
                    fetch('/edit', {
                        method: 'POST',
                        body: `id=${index}&message=${newMessage}`,
                        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                    })
                    .then((response) => response.json())
                    .then((data) => {
                        loadPosts();  // 投稿編集後、再度投稿をロード
                    });
                }
            });

            cover.appendChild(editButton);

            bbs.appendChild(cover);
        });
    });
}


