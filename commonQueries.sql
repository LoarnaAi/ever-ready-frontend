select * from jobs where display_job_id is not null order by created_at desc;
-- Removals@lionsmoves.co.uk

select * from business_master;

update business_master 
set 
bus_email = 'lionsmoves@yahoo.com', admins=Array['447936432077'] 
where bus_ref = 'LIMO';

-- Lionsmoves@yahoo.com;

update business_master 
set 
bus_email = 'lohith.uvce@gmail.com', admins=Array['447448440754'] 
where bus_ref = 'LIMO';

update business_master 
set
bus_email = 'ngncity@gmail.com', admins=Array['447850773336'] 
where bus_ref = 'LIMO';

update business_master 
set 
bus_email = 'admin@ever-ready.ai', admins=Array['447448440754'] 
where bus_ref = 'DEMO';


https://demo.ever-ready.ai/limo/home-removal/job-summary/LIMO-00052
https://demo.ever-ready.ai/limo/home-removal/job-detail/LIMO-00052

https://demo.ever-ready.ai/limo/home-removal/job-detail/{{1}}


curl -I https://demo.ever-ready.ai/limo/home-removal/job-detail/d49c3ab4-1045-4a5a-90fe-23c7c5f17afb


curl -X POST http://localhost:3000/api/quotes/calculate \
    -H "Content-Type: application/json" \
    -d '{"busRef":"DEMO","furnitureItems":[{"itemId":"single-bed","quantity":1},{"itemId":"sofa-2-seater","quantity":1}],"homeSize":"1-bedroom","distanceMiles":1.5}'