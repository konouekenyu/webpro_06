"use strict";

let number=0;  //投稿件数をいくつ読んだか
const bbs = document.querySelector('#bbs');
document.querySelector('#post').addEventListener('click', () => {
    const name = document.querySelector('#name').value;  //投稿者の名前
    const message = document.querySelector('#message').value;  //投稿内容

    const params = {  // URL Encode
        method: "POST",
        body:  'name='+name+'&message='+message,  //名前と投稿内容　＆はパラメータが変わるためにある
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    console.log( params );
    const url = "/post";
    fetch( url, params )
    .then( (response) => {  //fetchが上手くいったら20行目から実行する．だめなときはエラーが出る
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        console.log( response );
        document.querySelector('#message').value = ""; //投稿内容が来ているか確認するためにあえて消している
    });
});

document.querySelector('#check').addEventListener('click', () => { //もし新しい投稿があったら持ってくる
    const params = {  // URL Encode
        method: "POST",
        body:  '',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };
    const url = "/check";
    fetch( url, params )
    .then( (response) => {
        if( !response.ok ) {
            throw new Error('Error');
        }
        return response.json();
    })
    .then( (response) => {
        let value = response.number;
        console.log( value );

        console.log( number );
        if( number != value ) {
            const params = {
                method: "POST",
                body: 'start='+number,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'               
                }
            }
            const url = "/read";
            fetch( url, params )
            .then( (response) => {
                if( !response.ok ) {
                    throw new Error('Error');
                }
                return response.json();
            })
            .then( (response) => { //投稿が来たら表示する部分
                number += response.messages.length;
                for( let mes of response.messages ) {
                    console.log( mes );  // 表示する投稿
                    let cover = document.createElement('div');
                    cover.className = 'cover';
                    let name_area = document.createElement('span');
                    name_area.className = 'name';
                    name_area.innerText = mes.name;
                    let mes_area = document.createElement('span');
                    mes_area.className = 'mes';
                    mes_area.innerText = mes.message;
                    cover.appendChild( name_area ); //coverの中にname_areaをくっつける
                    cover.appendChild( mes_area ); //coverの中にmes_areaをくっつける

                    bbs.appendChild( cover );
                }
            })
        }
    });
});