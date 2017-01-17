export default function(e) {
    var id = e.currentTarget.id;
    e.preventDefault();
    e.stopPropagation();
    if (id === 'print') {


        var request = new XMLHttpRequest();
        request.open('GET', './print.html', true);

        request.onload = function() {

            // Success!
            var resp = this.response;
            console.log(resp);
            var w = window.open();
            w.document.write(resp);
            console.log(w.document);
            w.print();
            w.close();


        };
        request.send();


    } else {
        var win = window.open('./resume.' + id, '_blank');
        if (win) {
            //Browser has allowed it to be opened
            win.focus();
        } else {
            //Browser has blocked it
            window.open('./resume.' + id, '_self');
        }
    }

}
