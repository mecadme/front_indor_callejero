import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import useSponsors from "../../hooks/useSponsors";

const Sponsors = ({maxContributions}) => {
  const { sponsors, isLoading, error } = useSponsors();

  if (isLoading) {
    return <div>Cargando auspiciantes...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <footer className="footer container text-center">
      <div className="row justify-content-center">
        {sponsors.length > 0 ? (
          sponsors.map(
            (sponsor) =>
              sponsor.contributionAmount > maxContributions && (
                <div key={sponsor.sponsorId} className="col-4 col-md-2 mb-4">
                  <img
                    src={sponsor.photoUrl}
                    alt={sponsor.sponsor}
                    className="img-fluid"
                    style={{ maxHeight: "100px" }}
                  />
                </div>
              )
          )
        ) : (
          <div>No hay patrocinadores disponibles</div>
        )}
      </div>
    </footer>
  );
};

export default Sponsors;
