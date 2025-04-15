export interface TouristSpot {
    id: string;
    name: string;
    description: string;
    latitude: number;
    longitude: number;
    image: string;
    category: 'historical' | 'natural' | 'cultural' | 'entertainment';
  }
  
  export const touristSpots: TouristSpot[] = [
    {
      id: '1',
      name: 'Cristo Redentor',
      description: 'Uma das Sete Maravilhas do Mundo Moderno, o Cristo Redentor é um símbolo icônico do Rio de Janeiro e do Brasil.',
      latitude: -22.951916,
      longitude: -43.210487,
      image: 'https://images.unsplash.com/photo-1593995863951-57c27e518295?auto=format&fit=crop&q=80&w=800',
      category: 'historical'
    },
    {
      id: '2',
      name: 'Pão de Açúcar',
      description: 'O complexo do Pão de Açúcar oferece vistas deslumbrantes da cidade através de um passeio de bondinho.',
      latitude: -22.9492,
      longitude: -43.1545,
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?auto=format&fit=crop&q=80&w=800',
      category: 'natural'
    },
    {
      id: '3',
      name: 'Praia de Copacabana',
      description: 'Uma das praias mais famosas do mundo, Copacabana é conhecida por sua orla vibrante e calçadão icônico.',
      latitude: -22.9714,
      longitude: -43.1823,
      image: 'https://images.unsplash.com/photo-1548963670-2a1292e8f1c6?auto=format&fit=crop&q=80&w=800',
      category: 'entertainment'
    },
    {
      id: '4',
      name: 'Maracanã',
      description: 'O maior estádio do Brasil e palco de momentos históricos do futebol mundial.',
      latitude: -22.9121,
      longitude: -43.2301,
      image: 'https://images.unsplash.com/photo-1619465712476-551293494cd7?auto=format&fit=crop&q=80&w=800',
      category: 'entertainment'
    }
  ];