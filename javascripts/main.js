$(function(){
  var events = [];
  var links = {};

  var processData = function(data){
    data.forEach(function(course){
      course['runs'].forEach(function(run){
        links[course['name']] = course['url'];

        if (run['start_date']) {
          var start = run['start_date'];
          var end = moment(start, 'YYYY-MM-DD').add(run['duration_in_weeks'], 'weeks').subtract(1, 'day')

          events.push({
            content: course['name'],
            start: start,
            end: end.format('YYYY-MM-DD'),
            className: URLify(course['categories'][0] || 'none')
          })
        }
      })
    })
    initVisualization();
  }


  var initVisualization = function(){
    var container = document.getElementById('visualization');

     var data = new vis.DataSet(events);

     var options = {
       margin: {
         item: 2
       },
       zoomable: false,
       zoomMax: 30000000000,
       min: new Date(2013, 9, 1),
       max: moment().add(6, 'months')
     };

     var timeline = new vis.Timeline(container, data, options);

     $('.item').hover(function(e){
       var text = $(e.target).text()
       $('.item').removeClass('selected').filter(function(i, item){
         return ($(item).text() === text)
       }).addClass('selected')
     });

     $('.item').click(function(e){
       var text = $(e.target).text()
       window.location = links[text]
     });
  }

  jQuery.getJSON('javascripts/courses.json', processData)

});
