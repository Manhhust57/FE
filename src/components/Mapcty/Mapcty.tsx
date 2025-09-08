import React from "react";
import "./Mapcty.css";
const Mapcty = () => {
  return (
    <div className="map-cty-main">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3723.502480086302!2d105.79025815030758!3d21.052584022806705!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3135ab1a4c13caab%3A0xeacc95be8bf20882!2s901A%20Starlake!5e0!3m2!1svi!2s!4v1741919002451!5m2!1svi!2s"
        width="1920px"
        height="500px"
        style={{ border: 0 }}
        allowFullScreen={true}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title="Cinema Location Map"
      ></iframe>
    </div>
  );
};

export default Mapcty;
