enum Rank {
  "NEW_USER" = 0, // user exists, but hasn't finished sign-up Step 1 (this is the DB default)
  "INACTIVE_MEMBER" = 1, // "V1 Community"
  "ACTIVE_MEMBER" = 2, // "V1 Member"
  "LEADERSHIP" = 3,
}

export default Rank;
