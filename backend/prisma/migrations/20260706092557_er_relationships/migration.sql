-- ER fixes: enforce unique hostel names and make Student.preferredHostel a
-- real foreign key into Hostel.name (referential integrity).

-- Hostel names must be unique (allocation logic and preferredHostel rely on it)
CREATE UNIQUE INDEX "Hostel_name_key" ON "Hostel"("name");

-- A student's preferredHostel must match an existing hostel name.
-- Optional relation: clear it if the hostel is deleted, follow renames.
ALTER TABLE "Student" ADD CONSTRAINT "Student_preferredHostel_fkey" FOREIGN KEY ("preferredHostel") REFERENCES "Hostel"("name") ON DELETE SET NULL ON UPDATE CASCADE;
