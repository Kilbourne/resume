export default (function(arr) {
    arr.forEach(function(item) {
        item.remove = item.remove || function() {
            this.parentNode.removeChild(this);
        };
    });
})([Element.prototype, CharacterData.prototype, DocumentType.prototype]);
