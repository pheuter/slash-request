chrome.devtools.network.onRequestFinished.addListener(
    function(request) {
      if (/json/.test(request.response.content.mimeType)) {
        request.getContent(function(content, encoding) {
          response = $.parseJSON(content);

          // Populate panel with page data
          if (response.page_data != null && response.page_data.text != null) {
            $.each(response.page_data.text, function(key, value) {
              $('#text-keys > tbody:last').append("<tr><td>"+key+"</td><td>"+value+"</td></tr>");
            });
          }

          // Populate panel with model data
          if (response.model_data != null) {

            // resource = 'Reward'
            // types = {
            //   featured_rewards: {}
            // }
            $.each(response.model_data, function(resource, types) {
              var rid = 'resource-' + resource;
              var $resource = $("<div class='accordion' id='"+rid+"'> \
                  <div class='accordion-group'> \
                    <div class='accordion-heading'> \
                      <a class='accordion-toggle' data-toggle='collapse' data-parent='#"+rid+"' href='#collapse-"+rid+"'> \
                        "+resource+"</a> \
                    </div> \
                    <div id='collapse-"+rid+"' class='accordion-body collapse'> \
                      <div class='accordion-inner'></div> \
                    </div> \
                  </div> \
                </div>");

              // model = 'featured_rewards'
              // data = [
              //  {
              //    category_name: '',
              //    title: ''
              //  },
              //  {
              //    category_name: '',
              //    title: ''
              //  }
              // ]
              $.each(types, function(model, data) {
                var $model = $("<div><h4>" + model + "</h4></div>");
                // row = {
                //   category_name: '',
                //   title: ''
                // }
                $.each(data, function(_, row) {
                  $model.append("<table class='table table-condensed table-striped table-bordered'> \
                    <thead> \
                      <tr> \
                        " + $.map(row, function(_, prop) { return "<th>"+prop+"</th>";}).join('') + " \
                      </tr> \
                    </thead> \
                    <tbody> \
                      <tr> \
                        " + $.map(row, function(value) { return "<td>"+JSON.stringify(value,null,2)+"</td>";}).join('') + " \
                      </tr> \
                    </tbody> \
                  </table>");
                });

                $resource.find('#collapse-'+rid+' > .accordion-inner').append($model);
              });

              $('#collapseModelData > .accordion-inner').append($resource);
            });
          }
        });
      }
});

$(document).ready(function() {

  // Override jQuery :contains selector to be case insensitive
  $.expr[":"].contains = $.expr.createPseudo(function(arg) {
    return function( elem ) {
        return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
  });

  $('a#reset').click(function() {
    $('table#text-keys > tbody').empty();
    $('#collapseModelData > .accordion-inner').empty();
  });

  $('#filter-textkeys').keyup(function() {
    if ($(this).val() == '') {
      $('#text-keys > tbody tr').show();
    } else {
      $('#text-keys > tbody tr:contains("'+$(this).val()+'")').show();
      $('#text-keys > tbody tr:not(:contains("'+$(this).val()+'"))').hide();
    }
  });
});
