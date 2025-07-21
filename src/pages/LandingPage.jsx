import { Link } from "react-router-dom";
import { useEvent } from "../contexts/EventContext";
import { formatRupiah } from "../utils/formatRupiah";
import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  TrophyIcon,
  ClockIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import BgRunningForest from "../assets/bg-running-forest-2-black.jpg";
import BgSponsor1 from "../assets/sponsor1.jpeg";
import BgSponsor2 from "../assets/sponsor2.jpeg";

const LandingPage = () => {
  const { events } = useEvent();
  const upcomingEvents = events
    .filter((event) => new Date(event.date) > new Date())
    .slice(0, 3);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-secondary-600 min-h-screen flex items-center">
        <div className="absolute inset-0 bg-navy-900 opacity-70 z-10"></div>
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${BgRunningForest})`,
          }}
        ></div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Trail Run KebonKito
            <span className="block text-orange-300">Lubuklinggau</span>
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-3xl mx-auto">
            Rasakan sensasi berbeda dengan berlari di alam sambil mengeksplore
            keindahan alam sekitar dengan rute yang menantang dan menyesuaikan
            untuk pemula
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/events" className="btn-primary text-lg px-8 py-4">
              Lihat Event
            </Link>
            <Link
              to="/register"
              className="btn-outline bg-white text-primary-600 hover:bg-primary-600 hover:text-white text-lg px-8 py-4"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 ">
              Kenapa Pilih KebonKito TrailRun?
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto ">
              Kami menghadirkan pengalaman trail running yang tak terlupakan
              dengan fasilitas terbaik
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPinIcon className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Lokasi Terbaik</h3>
              <p className="text-navy-600">
                Rute trail running di lokasi-lokasi indah dengan pemandangan
                alam yang menakjubkan
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Komunitas Solid</h3>
              <p className="text-navy-600">
                Bergabung dengan ribuan runner yang passionate dan saling
                mendukung
              </p>
            </div>

            <div className="card text-center">
              <div className="w-16 h-16 bg-navy-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrophyIcon className="h-8 w-8 text-navy-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Event Berkualitas</h3>
              <p className="text-navy-600">
                Event trail running yang terorganisir dengan baik dan safety
                terjamin
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-navy-50 bg-gradient-to-r from-green-600 to-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4 text-white">
              Event Mendatang
            </h2>
            <p className="text-xl text-navy-600 text-white">
              Jangan lewatkan kesempatan untuk berpartisipasi dalam event-event
              seru kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="card group hover:shadow-2xl transition-shadow duration-300"
              >
                <div className="relative overflow-hidden rounded-lg mb-4">
                  <img
                    src={
                      event.image ||
                      "https://images.pexels.com/photos/2402926/pexels-photo-2402926.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=1"
                    }
                    alt={event.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {event.category}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                <p className="text-gray-600 mb-4">
                  {event.description.length > 250
                    ? `${event.description.substring(0, 250)}...`
                    : event.description}
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-navy-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>
                      {new Date(event.date).toLocaleDateString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center text-navy-500">
                    <MapPinIcon className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-navy-500">
                    <ClockIcon className="h-4 w-4 mr-2" />
                    <span>{event.time}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {formatRupiah(event.price)}
                  </span>
                  <Link
                    to={`/events/${event.id}`}
                    className="btn-primary text-sm"
                  >
                    Daftar
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/events" className="btn-secondary text-lg px-8 py-4">
              Lihat Semua Event
            </Link>
          </div>
        </div>
      </section>

      {/* Why Trail Running */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                Mengapa Trail Running?
              </h2>
              <p className="text-lg text-navy-600 mb-6">
                Trail running bukan hanya olahraga biasa. Ini adalah cara hidup
                yang menggabungkan kebugaran fisik, mental wellness, dan koneksi
                dengan alam.
              </p>

              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy-900">
                      Meningkatkan Kebugaran
                    </h3>
                    <p className="text-navy-600">
                      Latihan yang lebih menantang dari running biasa
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-secondary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy-900">
                      Mengurangi Stress
                    </h3>
                    <p className="text-navy-600">
                      Terapi alami di tengah keindahan alam
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-navy-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy-900">
                      Membangun Komunitas
                    </h3>
                    <p className="text-navy-600">
                      Bertemu dengan orang-orang yang berpikiran sama
                    </p>
                  </div>
                </div>

                <div className="flex items-start">
                  <CheckCircleIcon className="h-6 w-6 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-navy-900">
                      Menjelajahi Alam
                    </h3>
                    <p className="text-navy-600">
                      Menemukan tempat-tempat indah yang tersembunyi
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <img
                src={BgRunningForest}
                alt="Trail Running"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-secondary-600 text-white p-6 rounded-lg">
                <div className="text-center">
                  <div className="text-3xl font-bold">1000+</div>
                  <div className="text-sm">Happy Runners</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor Section */}
      <section className="py-20 bg-navy-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-navy-900 mb-4">
              Sponsor Kami
            </h2>
            <p className="text-xl text-navy-600 max-w-2xl mx-auto">
              Didukung oleh brand-brand terpercaya yang berkomitmen untuk
              mendukung komunitas trail running
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={BgSponsor1}
                  alt="Sponsor 1"
                  className="w-full max-w-xs mx-auto object-contain"
                />
              </div>
            </div>

            <div className="text-center">
              <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <img
                  src={BgSponsor2}
                  alt="Sponsor 2"
                  className="w-full max-w-xs mx-auto object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Siap untuk Petualangan Baru?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan komunitas trail running terbesar di Indonesia
            dan mulai petualangan Anda hari ini!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="btn-secondary bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-4"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/events"
              className="btn-outline border-white text-white hover:bg-white hover:text-primary-600 text-lg px-8 py-4"
            >
              Lihat Event
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
