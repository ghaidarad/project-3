
$(document).ready(function () {

    $.get("http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=15&callback=",
        function (q) {
            console.log(q)
            q.forEach(el =>{
              $('.quote').append(el.content + "<p>— " + el.title + "-</p>").hide()
              
              
            })
           
        });

    let db = firebase.firestore().collection('quotes')

    let resList = $('.res-container')

    db.get()
        .then(result => {
            let datas = result.docChanges()

            datas.forEach(ele => {
                console.log(ele.doc.data());
                resList.append(`<li data-id ="${ele.doc.id}">${ele.doc.data().content} - ${ele.doc.data().title} 
        <button class="edit">edit</button> <button class="delete">delete</button></li>`)

            });
        }).catch(err => console.log(err))


    resList.on('click', ".edit", function () {
        let id = $(this).parent().data("id")

        db.doc(id).get().then(ress => {

             $('input[name=content]').val(ress.data().content)
             $('input[name=title]').val(ress.data().title)
             $('.update').attr("data-id", id)

            $(".submit").hide()
            $('.update').show()

        })
       
    })
    $(".update").on('click', function () {
        let id = $(this).data("id")
        console.log(id)
        

        let content = $('input[name=content]').val()
        let title = $('input[name=title]').val()
        
        db.doc(id).update({
            content: content,
            title: title
        })
    })
    

    $('.submit').click(function () {
        let content = $('input[name=content]').val()
        let title = $('input[name=title]').val()

        console.log(content);
        console.log(title);

        db.add({
            content: content,
            title: title
        }).then(res => {
            resList.append(`<p data-id ="${res.id}"> ${content} <br> - ${title} -
            <br> <button class="edit">edit</button> <button class="delete">delete</button></p>`)

        })

    })

    resList.on('click', ".delete", function () {
        let id = $(this).parent().data("id")
        db.doc(id).delete().then(suc => {
            $(this).parent().remove()
        })
    })


    resList.on("click", ".allquote", function () {
        $('.userquote').hide();
        $('.quote').show()

    })

    resList.on("click", ".home", function () {
        $('.quote').hide();
        $('.userquote').show()

    })


})
