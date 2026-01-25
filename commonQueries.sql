select * from jobs where display_job_id is not null order by created_at desc;
-- Removals@lionsmoves.co.uk

select * from business_master;

update business_master 
set 
bus_email = 'Removals@lionsmoves.co.uk', admins=Array['447936432077'] 
where bus_ref = 'LIMO';


update business_master 
set 
bus_email = 'lohith.uvce@gmail.com', admins=Array['447448440754'] 
where bus_ref = 'LIMO';

update business_master 
set 
bus_email = 'ngncity@gmail.com', admins=Array['447448440754'] 
where bus_ref = 'LIMO';

