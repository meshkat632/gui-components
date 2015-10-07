import moment from 'moment';
import jquery from 'jquery';
let app = {
    start:function($window){
        console.log('starting callcontrol app', moment());
        console.log('$window:',$window);
        jquery('body').append('jquery is ready');
    }
};
export default app;

